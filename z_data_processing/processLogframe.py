import pandas as pd
import re
import os

############################################################
#
#            SETUP
#
############################################################

project_id = 43
file_name = './unprocessed_logframes/43_solentoysterrestoration.xlsx'
switch = 'live'
project_name = 'Solent Oyster Restoration'
project_slug = 'solentoysterrestoration'
project_organisation_id = 1
project_highlight_color = "#4fa0a4"
project_pm = "fa8bf85d-8a92-4f5d-bee1-2a804187f8a5"

project_meta = {
    'id': project_id, 
    'name': project_name, 
    'slug': project_slug,
    'organisation_id': project_organisation_id, 
    'highlight_color': project_highlight_color, 
    'project_manager_id': project_pm
}

project_df = pd.DataFrame(project_meta, index=[0])

############################################################
#
#            IMPACT
#
############################################################

impact_df = pd.read_excel(file_name, sheet_name='Impact and Outcome', header=None)

impact_title = impact_df.iloc[0, 1]
if pd.isnull(impact_title):
    impact_title = 'Impact TBC'

impact_indicators_df = pd.read_excel('impactindicators.xlsx', sheet_name='impactindicators', header=0)
impact_indicators_lookup_df = pd.read_excel('impactindicators.xlsx', sheet_name='lookup', header=0)

impact_data = {
    'project_id': project_id,
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
        if pd.isnull(outcome_desc):
            outcome_desc = 'Outcome TBC' 
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
        if pd.isnull(outcome_indicator_desc):
            outcome_indicator_desc = 'Outcome indicator TBC' 
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
all_activities = []

for sheet_name in output_sheets:
    read_output_df = pd.read_excel(file_name, sheet_name=sheet_name, header=None, skiprows=3)

    # Initialize variables to track the current output
    current_output_id = None
    current_output_code = None
    current_output_name = None

    # Flag to indicate if we are currently processing activity rows
    processing_activities = False
    # Counter to skip header rows immediately after "Activities" header
    activity_header_rows_to_skip = 2

    # Iterate through the DataFrame rows
    for index, row in read_output_df.iterrows():
        
        # When "Activities" header is found, start processing activities instead of breaking
        if "Activities" in row.iloc[:1].values:
            processing_activities = True
            continue  # Move to the next iteration to skip processing the current "Activities" header row

        # Skip the two header rows immediately following the "Activities" header
        if processing_activities and activity_header_rows_to_skip > 0:
            activity_header_rows_to_skip -= 1
            continue  # Move to the next iteration to skip processing these header rows

        if processing_activities:
            # Process activity data here
            code = row.iloc[3]
            description = row.iloc[4]
            status = row.iloc[7]
            notes = row.iloc[8]

            current_activity_code = str(row.iloc[3])
            current_activity_code_parts = current_activity_code.split('.')
            if len(current_activity_code_parts) >= 2:
                current_activity_number = int(current_activity_code_parts[-2]) if current_activity_code_parts[-2].isdigit() else 0
            else:
                current_activity_number = 0
            current_activity_decimal = int(current_activity_code_parts[-1]) if current_activity_code_parts[-1].isdigit() else 0
            current_activity_number_padded = f"{current_activity_number:02d}"
            current_activity_decimal_padded = f"{current_activity_decimal:02d}"
            
            if pd.notnull(description): 
                all_activities.append({
                    'id': f"{current_output_id}{99}{current_activity_number_padded}{current_activity_decimal_padded}",
                    'output_id': current_output_id,
                    'code': code,
                    'description': description,
                    'status': status,
                    'notes': notes,
                })
            continue  # Ensure further processing for outputs/output indicators doesn't occur in activity rows

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
            parent_outcome_indicator_id = None
            for item in outcome_indicator_outputs_lookup:
                if output_number in item['outcome_indicator_outputs']:
                    parent_outcome_indicator_id = item['id']
                    break
                else: 
                    parent_outcome_indicator_id = f"{project_id}0000"

            output_id = f"{parent_outcome_indicator_id}{current_output_number_padded}"
            current_output_id = output_id

            if pd.notnull(output_desc):
                all_outputs.append({
                    'id': output_id,
                    'project_id': project_id,
                    'outcome_measurable_id': parent_outcome_indicator_id,
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
                # Marks as 'progress'
                ii_id = 906

            output_indicator_id = f"{current_output_id}{output_indicator_number_padded}"

            if pd.notnull(output_indicator_desc): 
                all_output_indicators.append({
                    'id': output_indicator_id,
                    'project_id': project_id,
                    'output_id': current_output_id,
                    'code': output_indicator_code,
                    'description': output_indicator_desc, 
                    'unit': output_indicator_unit, 
                    'target': output_indicator_target,
                    'assumptions': output_indicator_assumption,
                    'verification': output_indicator_verification,
                    'impact_indicator_id': ii_id
                })

############################################################
#
#            UNPLANNED OUTPUTS
#
############################################################

unplanned_output_sheet = [sheet for sheet in xls.sheet_names if sheet.startswith('Unplanned')]

for sheet_name in unplanned_output_sheet:
    read_unplanned_output_df = pd.read_excel(file_name, sheet_name=sheet_name, header=None, skiprows=3)

    unplanned_output_id = f"{project_id}000000"

    all_outputs.append({
                'id': unplanned_output_id,
                'project_id': project_id,
                'outcome_indicator_id': None,
                'code': "U.0",
                'description': "Unplanned outputs",
            })

    for index, row in read_unplanned_output_df.iterrows():
        
        if pd.isnull(row.iloc[1]):
            break

        unplanned_output_code_parts = row.iloc[0].strip().split('.')
        unplanned_output_number = int(unplanned_output_code_parts[-1])
        unplanned_output_number_padded = f"{unplanned_output_number:02d}"

        unplanned_old_impact_indicator = row.iloc[4]

        try:
            lookup_value = impact_indicators_lookup_df.loc[impact_indicators_lookup_df['old_impact_indicator_code'] == unplanned_old_impact_indicator, 'new_impact_indicator_code'].values[0]
            ii_id = impact_indicators_df.loc[impact_indicators_df['ii_code'] == lookup_value, 'id'].values[0]
        except IndexError:
            # Marks as 'progress'
            ii_id = 906

        all_output_indicators.append({
            'id': f"{unplanned_output_id}{unplanned_output_number_padded}",
            'project_id': project_id,
            'output_id': unplanned_output_id,
            'code': row.iloc[0].strip().replace(" ", ""),
            'description': row.iloc[1], 
            'unit': row.iloc[3], 
            'target': row.iloc[2],
            'assumption': '',
            'verification': '',
            'impact_indicator_id': ii_id
        })

# Convert the lists into DataFrames
outcomes_df = pd.DataFrame(outcomes)
outcome_indicators_df = pd.DataFrame(outcome_indicators)
outputs_df = pd.DataFrame(all_outputs)
outputs_df = outputs_df.sort_values(by='id')
output_indicators_df = pd.DataFrame(all_output_indicators)
activities_df = pd.DataFrame(all_activities)

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
save_or_append_to_csv(project_df, f'./parsed_csv_files/{switch}/projects.csv')
save_or_append_to_csv(impact_df, f'./parsed_csv_files/{switch}/impacts.csv')
save_or_append_to_csv(outcomes_df, f'./parsed_csv_files/{switch}/outcomes.csv')
save_or_append_to_csv(outcome_indicators_df, f'./parsed_csv_files/{switch}/outcome_indicators.csv')
save_or_append_to_csv(outputs_df, f'./parsed_csv_files/{switch}/outputs.csv')
save_or_append_to_csv(output_indicators_df, f'./parsed_csv_files/{switch}/output_indicators.csv')
save_or_append_to_csv(activities_df, f'./parsed_csv_files/{switch}/activities.csv')
