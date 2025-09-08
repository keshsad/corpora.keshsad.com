import {
  ActionPanel,
  Form,
  Action,
  showToast,
  Toast,
} from "@raycast/api"
import { FormValidation, useForm } from "@raycast/utils"
import { setCorpus } from "./helpers/storage"
import { CorpusInput } from "./types"

export default function FetchContextForm() {
  const { handleSubmit, itemProps } = useForm<CorpusInput>({
    onSubmit: async (values) => {
      try {
        await setCorpus({ ...values })

        showToast({
          style: Toast.Style.Success,
          title: "Success!",
          message: `Saved ${values.title} to Local Storage`
        })
      } catch {
        console.error("Failed to save corpus")

        showToast({
          style: Toast.Style.Failure,
          title: "Uh oh!",
          message: "Failed to save corpus"
        })
      }
    },
    validation: {
      folder: (value) => { if (value === undefined || value.length == 0) return FormValidation.Required },
      title: (value) => { if (value === undefined || value === "") return FormValidation.Required },
    }
  })

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField {...itemProps.title} title="Title" />
      <Form.FilePicker {...itemProps.folder} title="Folder" allowMultipleSelection={false} canChooseDirectories canChooseFiles={false} />
    </Form>
  )
}
