import pandas as pd
import os

output_indicators = pd.read_csv("./parsed_csv_files/output_indicators.csv", header=0)

all_updates = pd.read_csv("./all_updates.csv", header=0)

unprocessed_updates = []
matched_updates = []

for index, row in output_indicators.iterrows(): 
    output_indicator_id = row["id"]
    project_id = row["project_id"]
    output_code = row["code"]

    for index, update in all_updates.iterrows():
        if project_id == update["Proj No"]:
            if output_code == update["Output Code"]:
                if not update["Year"]:
                    unprocessed_updates.append(update)
                else:
                    date = f"{update['Year']}-{update['Month']}-01"
                    description = update["Stat"]
                    value = update["Value"]
                    if str(update["Impact indicator new"]).isdigit():
                        type = 'Impact'
                    else:
                        type = 'progress'
                    
                    matched_update = {
                        "project_id": project_id,
                        "output_indicator_id": output_indicator_id,
                        "date": date,
                        "description": description,
                        "value": value,
                        "type": type
                    }
                    matched_updates.append(matched_update)
            else:
                unprocessed_updates.append(update)

print(unprocessed_updates)

# Convert the lists into DataFrames
matched_updates_df = pd.DataFrame(matched_updates)

############################################################
#
#            WRITE TO CSV FILES
#
############################################################

# Function to save or append DataFrame to CSV
def save_or_append_to_csv(df, filename):
    file_exists = os.path.exists(filename)
    if file_exists:
        # Append without headers
        df.to_csv(filename, mode='a', header=False, index=False)
    else:
        # Write with headers
        df.to_csv(filename, mode='w', header=True, index=False)

# Example usage with your DataFrames
save_or_append_to_csv(matched_updates_df, './parsed_csv_files/matched_updates.csv')
