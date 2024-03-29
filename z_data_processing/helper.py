import pandas as pd
from datetime import datetime
import os

# Function to convert to float and ignore errors, then filter out rows
def convert_to_float_and_filter(df, column_name):
    df[column_name] = pd.to_numeric(df[column_name], errors='coerce')
    return df.dropna(subset=[column_name])

# Load data from CSV files
output_indicators = pd.read_csv("./parsed_csv_files/output_indicators.csv")
all_updates = pd.read_csv("./all_updates.csv")

# Ensure the 'project_id' and 'Proj No' columns are of compatible types
output_indicators['project_id'] = output_indicators['project_id'].astype(str)
all_updates['Proj No'] = all_updates['Proj No'].astype(str)

# Merge the DataFrames on the project ID columns
# Filter all_updates DataFrame
filtered_updates = all_updates[all_updates['Proj No'].isin(output_indicators['project_id'])]

# Get the desired columns from output_indicators
desired_columns = output_indicators[output_indicators['project_id'].isin(all_updates['Proj No'])][['project_id', 'id']]

# Reset the indices of both DataFrames
filtered_updates.reset_index(drop=True, inplace=True)
desired_columns.reset_index(drop=True, inplace=True)

# Concatenate the desired columns to the filtered_updates DataFrame
matched_updates = pd.concat([filtered_updates, desired_columns], axis=1)

# Separate updates based on the presence of required data
processable_updates = []
unprocessable_updates = []

def is_valid_month(short_month):
    if pd.isna(short_month):  # Check if the month value is NaN
        return False
    try:
        # Ensure short_month is a string and try parsing it
        datetime.strptime(str(short_month), '%b')
        return True
    except ValueError:
        return False

for index, row in matched_updates.iterrows():
    if pd.notnull(row['Output Code']) and pd.notnull(row['Year']) and is_valid_month(row['Month']):
        processable_updates.append(row)
    else:
        unprocessable_updates.append(row)

processable_updates_df = pd.DataFrame(processable_updates)
unprocessable_updates_df = pd.DataFrame(unprocessable_updates)

# Function to convert month abbreviation to month number
def month_to_num(short_month):
    return datetime.strptime(short_month, '%b').month

# Process the updates
parsed_updates = []

for index, row in processable_updates_df.iterrows():
    project_id = row['project_id']
    output_indicator_id = row['id']  # Make sure this column is in your DataFrame
    
    # Convert 'Month' abbreviation to number and format the 'date'
    month_num = month_to_num(row['Month'])
    date = f"{row['Year']}-{month_num:02d}-01"
    
    # Determine 'type'
    # type_ = 'Impact' if str(row.get('Impact indicator new', '')).strip()[0].isdigit() else 'Progress'
    type_ = 'Whatever'
    
    # Create parsed update dict
    parsed_update = {
        "project_id": project_id,
        "output_indicator_id": output_indicator_id,
        "date": date,
        "description": row['Stat'],
        "value": row['Value'],
        "type": type_
    }
    
    parsed_updates.append(parsed_update)

# Convert the list of dictionaries to a DataFrame for further use
parsed_updates_df = pd.DataFrame(parsed_updates)

# Display the first few processed entries
print(parsed_updates_df.head())


# Function to save or append DataFrame to CSV
def save_or_append_to_csv(df, filename):
    if not df.empty:  # Check if the DataFrame is not empty
        file_exists = os.path.exists(filename)
        if file_exists:
            # Append without headers
            df.to_csv(filename, mode='a', header=False, index=False)
        else:
            # Write with headers
            df.to_csv(filename, mode='w', header=True, index=False)

# Save the matched and unmatched updates to their respective CSV files
save_or_append_to_csv(parsed_updates_df, './parsed_csv_files/matched_updates.csv')
save_or_append_to_csv(unprocessable_updates_df, './parsed_csv_files/unprocessed_updates.csv')
