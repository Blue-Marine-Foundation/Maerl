import { ProjectMetadata } from '@/_lib/types'
import { useState, forwardRef, useCallback } from 'react'
import ProjectMetadataServerAction from './server-action'
import { PlusIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

type TextInputProps = {
  label: string
  name: keyof ProjectMetadata
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex gap-4 items-baseline">
    <h3 className="text-muted-foreground flex-shrink-0 w-40">{label}:</h3>
    <input
      className="flex-grow bg-white/10 px-2 py-1 text-foreground"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
)

type SelectInputProps = {
  label: string
  name: keyof ProjectMetadata
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div className="flex gap-4 items-baseline">
    <h3 className="text-muted-foreground flex-shrink-0 w-40">{label}:</h3>
    <select
      className="flex-grow bg-white/10 px-2 py-1 text-foreground"
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

type JsonbInputProps = {
  label: string
  field: keyof ProjectMetadata
  entries: any[]
  handleJsonbChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    key: string
  ) => void
  handleAddEntry: () => void
  entryTemplate: any
}

const JsonbInput: React.FC<JsonbInputProps> = ({
  label,
  field,
  entries,
  handleJsonbChange,
  handleAddEntry,
  entryTemplate,
}) => (
  <div className="flex gap-4 items-baseline">
    <h3 className="text-muted-foreground flex-shrink-0 w-40">{label}:</h3>
    <div className="text-foreground flex-grow flex flex-col items-start gap-2">
      {entries.map((entry, index) => (
        <div key={index} className="flex gap-1">
          {Object.keys(entryTemplate).map((key) => (
            <input
              key={key}
              className=" bg-white/10 px-2 py-1 text-foreground"
              name={key}
              value={entry[key] || ''}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              onChange={(e) => handleJsonbChange(e, index, key)}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        className="text-xs flex gap-1 items-center border rounded py-1 px-2 hover:bg-white/10 transition-all"
        onClick={handleAddEntry}
      >
        <PlusIcon size={16} /> Add {label.split(' ')[1]}
      </button>
    </div>
  </div>
)

const EditableProjectMetadataForm = forwardRef<
  HTMLFormElement,
  {
    entry: ProjectMetadata
    onSubmitSuccess: (formState: ProjectMetadata) => void
  }
>(({ entry, onSubmitSuccess }, ref) => {
  const [formState, setFormState] = useState<ProjectMetadata>(entry)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormState((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormState((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleJsonbChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
      key: string,
      field: keyof ProjectMetadata
    ) => {
      const { value } = e.target
      setFormState((prev) => {
        // @ts-expect-error
        const updatedField = [...(prev[field] || [])]
        updatedField[index] = { ...updatedField[index], [key]: value }
        return { ...prev, [field]: updatedField }
      })
    },
    []
  )

  const handleAddJsonbEntry = useCallback(
    (field: keyof ProjectMetadata, newEntry: any) => {
      setFormState((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), newEntry],
      }))
    },
    []
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { project_manager, ...filteredFormState } = formState

    const parsedFormState = {
      ...filteredFormState,
      local_contacts:
        formState.local_contacts?.filter(
          (contact) =>
            contact.name.trim() !== '' ||
            (contact.organisation?.trim() ?? '') !== ''
        ) || [],
    }

    const { data, error } = await ProjectMetadataServerAction(parsedFormState)
    if (error) {
      console.log(error)
      return
    }
    console.log(data)
    onSubmitSuccess(parsedFormState)
  }

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 py-6"
    >
      <div className="flex gap-4 items-baseline">
        <h3 className="text-muted-foreground flex-shrink-0 w-40">PM:</h3>
        <div className="text-foreground flex-grow">
          {entry.project_manager && <p>{entry.project_manager}</p>}
        </div>
      </div>
      <TextInput
        label="Support"
        name="support"
        value={formState.support || ''}
        onChange={handleChange}
        placeholder="Supporting staff"
      />
      <TextInput
        label="Start Date"
        name="start_date"
        value={formState.start_date || ''}
        onChange={handleChange}
        placeholder="Project start date"
      />
      <SelectInput
        label="Project Status"
        name="project_status"
        value={formState.project_status}
        onChange={handleSelectChange}
        options={[
          { label: 'Active', value: 'Active' },
          { label: 'Complete', value: 'Complete' },
          { label: 'Pipeline', value: 'Pipeline' },
        ]}
      />
      <TextInput
        label="Regional Strategy"
        name="regional_strategy"
        value={formState.regional_strategy || ''}
        onChange={handleChange}
        placeholder="Regional Strategy"
      />
      <TextInput
        label="Pillars"
        name="pillars"
        value={formState.pillars || ''}
        onChange={handleChange}
        placeholder="Pillars"
      />
      <TextInput
        label="Unit Requirements"
        name="unit_requirements"
        value={formState.unit_requirements || ''}
        onChange={handleChange}
        placeholder="Unit requirements"
      />
      <JsonbInput
        label="Local Contacts"
        field="local_contacts"
        entries={formState.local_contacts || []}
        handleJsonbChange={(e, index, key) =>
          handleJsonbChange(e, index, key, 'local_contacts')
        }
        handleAddEntry={() =>
          handleAddJsonbEntry('local_contacts', {
            name: '',
            organisation: '',
          })
        }
        entryTemplate={{ name: '', organisation: '' }}
      />
      <TextInput
        label="Highlights"
        name="highlights"
        value={formState.highlights || ''}
        onChange={handleChange}
        placeholder="Project highlights"
      />
      <TextInput
        label="Issues"
        name="current_issues"
        value={formState.current_issues || ''}
        onChange={handleChange}
        placeholder="Current issues"
      />
      <TextInput
        label="Proposed solutions"
        name="proposed_solutions"
        value={formState.proposed_solutions || ''}
        onChange={handleChange}
        placeholder="Proposed solutions"
      />
      <TextInput
        label="Board intervention req"
        name="board_intervention_required"
        value={formState.board_intervention_required || ''}
        onChange={handleChange}
        placeholder="Board intervention required"
      />
    </form>
  )
})

export default EditableProjectMetadataForm
