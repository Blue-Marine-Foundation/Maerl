import pandas as pd
import re
import os

############################################################
#
#            SETUP
#
############################################################

project_id = 34  
file_name = './berwickshire.xlsx' 

############################################################
#
#            IMPACT
#
############################################################

impact_df = pd.read_excel(file_name, sheet_name='Impact and Outcome', header=None)
impact_title = impact_df.iloc[0, 1] 

impact_indicators_df = pd.read_excel('impactindicators.xlsx', sheet_name='impactindicators', header=0)
impact_indicators_lookup_df = pd.read_excel('impactindicators.xlsx', sheet_name='lookup', header=0)

impact_data = {
    'projectID': project_id,
    'title': [impact_title]
}

impact_df = pd.DataFrame(impact_data)

############################################################
#
#            OUTCOMES
#
############################################################

read_outcome_df = pd.read_excel(file_name, sheet_name='Impact and Outcome', header=3)

# Define empty lists to store outcomes and outcome_indicators data
outcomes = []
outcome_indicators = []
outcome_indicator_outputs_lookup = [] 
outcome_id = 0

# Iterate through the DataFrame rows
for index, row in read_outcome_df.iterrows():
    # Check if the row is completely empty, which indicates the end of the data
    if row.isnull().all():
        break

    # If there's a non-empty value in the 'Outcome' column, it's a new outcome
    if pd.notnull(row.iloc[0]):
        outcome_id += 1
        outcome_code = row.iloc[1]
        outcome_code_parts = outcome_code.split('.')
        outcome_number = int(outcome_code_parts[-1])
        outcome_number_padded = f"{outcome_number:02d}"
        outcome_desc = row.iloc[2]
        db_outcome_id = f"{project_id}{outcome_number_padded}"
        
        outcomes.append({
            'id': db_outcome_id,
            'project_id': project_id,
            'code': outcome_code,
            'description': outcome_desc
        })


    # If there's a non-empty value in the 'Outcome Indicator' column, it's an indicator
    if pd.notnull(row.iloc[3]):
        outcome_indicator_code = row.iloc[3]
        outcome_indicator_code_parts = outcome_indicator_code.split('.')
        outcome_indicator_number = int(outcome_indicator_code_parts[-1])
        outcome_indicator_number_padded = f"{outcome_indicator_number:02d}"

        outcome_indicator_desc = row.iloc[4]
        outcome_indicator_verification = row.iloc[8]
        
        db_outcome_indicator_id = f"{db_outcome_id}{outcome_indicator_number_padded}"

        outcome_indicators.append({
            'id': db_outcome_indicator_id,
            'outcome_id': db_outcome_id,
            'project_id': project_id,
            'code': outcome_indicator_code,
            'description': outcome_indicator_desc,
            'verification': outcome_indicator_verification
        })

        # Get output <> outcome relationships for later
        if isinstance(row.iloc[5], str):
            outcome_indicator_outputs = [int(number.strip()) for number in row.iloc[5].split(',')]
        elif pd.notnull(row.iloc[5]):
            outcome_indicator_outputs = [int(row.iloc[5])]
        else:
            outcome_indicator_outputs = []

        outcome_indicator_outputs_lookup.append({
            'id': db_outcome_indicator_id,
            'outcome_indicator_outputs': outcome_indicator_outputs
        })

############################################################
#
#            OUTPUTS
#
############################################################
        
# Load the workbook to get the sheet names
xls = pd.ExcelFile(file_name)

# Filter for sheet names that match the pattern 'Output X'
output_sheets = [sheet for sheet in xls.sheet_names if sheet.startswith('Output')]

# Define empty lists to store data for all output sheets
all_outputs = []
all_output_indicators = []

for sheet_name in output_sheets:
    read_output_df = pd.read_excel(file_name, sheet_name=sheet_name, header=None, skiprows=3)

    # Initialize variables to track the current output
    current_output_id = None
    current_output_code = None
    current_output_name = None

    # Iterate through the DataFrame rows
    for index, row in read_output_df.iterrows():
        
        # Stop processing if the row contains "Activity"
        if "Activities" in row.iloc[:1].values:
            break

        # Check if the row is for a new output
        if pd.notnull(row.iloc[0]):
            
            output_number_match = re.search(r'Output (\d+)', sheet_name)
            if output_number_match:
                output_number = int(output_number_match.group(1))
            else:
                print("Issue with Output Number", sheet_name)
                continue  # Skip the sheet if the number can't be extracted
            current_output_code = str(row.iloc[1])
            current_output_code_parts = current_output_code.split('.')
            current_output_number = int(current_output_code_parts[-1])
            current_output_number_padded = f"{current_output_number:02d}"
            output_desc = row.iloc[2]
            
            # Lookup the parent outcome_indicator id
            for item in outcome_indicator_outputs_lookup:
              if output_number in item['outcome_indicator_outputs']:
                  parent_outcome_indicator_id = item['id']
                  break

            if parent_outcome_indicator_id:
                output_id = f"{parent_outcome_indicator_id}{current_output_number_padded}"
                current_output_id = output_id
                all_outputs.append({
                    'id': output_id,
                    'project_id': project_id,
                    'outcome_indicator_id': parent_outcome_indicator_id,
                    'code': current_output_code,
                    'description': output_desc, 
                })

        # Check if the row is for an output indicator
        if pd.notnull(row.iloc[3]) and current_output_id:
            output_indicator_code = row.iloc[3]
            output_indicator_code_parts = output_indicator_code.split('.')
            output_indicator_number = int(output_indicator_code_parts[-1])
            output_indicator_number_padded = f"{output_indicator_number:02d}"
            output_indicator_desc = row.iloc[4]
            output_indicator_unit = str(row.iloc[6]).strip()
            try:
                output_indicator_target = int(row.iloc[5])
            except ValueError:
                output_indicator_target = ''
            output_indicator_verification = row.iloc[8]
            try:
                output_indicator_assumption = row.iloc[9]
                if pd.isnull(output_indicator_assumption):
                    output_indicator_assumption = ''
            except ValueError:
                output_indicator_assumption = ''
            output_indicator_old_impact_indicator = row.iloc[7]

            try:
                lookup_value = impact_indicators_lookup_df.loc[impact_indicators_lookup_df['old_impact_indicator_code'] == output_indicator_old_impact_indicator, 'new_impact_indicator_code'].values[0]
                ii_id = impact_indicators_df.loc[impact_indicators_df['ii_code'] == lookup_value, 'id'].values[0]
            except IndexError:
                ii_id = 906

            output_indicator_id = f"{current_output_id}{output_indicator_number_padded}"
            all_output_indicators.append({
                'id': output_indicator_id,
                'project_id': project_id,
                'output_id': current_output_id,
                'code': output_indicator_code,
                'description': output_indicator_desc, 
                'unit': output_indicator_unit, 
                'target': output_indicator_target,
                'assumption': output_indicator_assumption,
                'verification': output_indicator_verification,
                'impact_indicator_id': ii_id
            })

# Convert the lists into DataFrames
outcomes_df = pd.DataFrame(outcomes)
outcome_indicators_df = pd.DataFrame(outcome_indicators)
outputs_df = pd.DataFrame(all_outputs)
outputs_df = outputs_df.sort_values(by='id')
output_indicators_df = pd.DataFrame(all_output_indicators)

############################################################
#
#            WRITE TO EXCEL SHEET
#
############################################################

# with pd.ExcelWriter('parsed.xlsx') as writer:
#     impact_df.to_excel(writer, sheet_name='Impact', index=False)
#     outcomes_df.to_excel(writer, sheet_name='Outcomes', index=False)
#     outcome_indicators_df.to_excel(writer, sheet_name='Outcome indicators', index=False)
#     outputs_df.to_excel(writer, sheet_name='Outputs', index=False)
#     output_indicators_df.to_excel(writer, sheet_name='Output Indicators', index=False)

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
save_or_append_to_csv(impact_df, 'impact.csv')
save_or_append_to_csv(outcomes_df, 'outcomes.csv')
save_or_append_to_csv(outcome_indicators_df, 'outcome_indicators.csv')
save_or_append_to_csv(outputs_df, 'outputs.csv')
save_or_append_to_csv(output_indicators_df, 'output_indicators.csv')
