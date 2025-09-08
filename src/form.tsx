import {
  ActionPanel,
  Form,
  Action,
  showToast,
  Toast,
  showHUD,
  LaunchProps,
  popToRoot,
} from "@raycast/api"
import { FormValidation, useForm } from "@raycast/utils"
import { setCorpus } from "./helpers/storage"
import { Corpus, CorpusInput } from "./types"
import { useRef, useState } from "react"
import { randomUUID } from "crypto"
import { join } from "path"
import { mkdir } from "fs"

export default function CorpusForm(props: LaunchProps<{ draftValues: CorpusInput, launchContext: Corpus }>) {
  const { draftValues, launchContext } = props

  const [title, setTitle] = useState<string>(draftValues?.title || launchContext?.title || "")
  const [folder, setFolder] = useState<string[]>(draftValues?.folder || (launchContext ? [launchContext.folder] : []) || [''])

  const textFieldRef = useRef<Form.TextField>(null)
  const filePickerRef = useRef<Form.FilePicker>(null)

  const { handleSubmit } = useForm<CorpusInput>({
    onSubmit: async (values) => {
      let item: CorpusInput, action: string

      try {
        if (!launchContext) {
          item = { ...values, id: randomUUID() }
          action = "Saved"
          await setCorpus(item)

          const rayDir = join(values.folder[0], ".ray")
          mkdir(rayDir, { recursive: true }, (err) => {
            if (err) console.error("Failed to create .ray dir:", err)
          })
        } else {
          item = { ...values, id: launchContext.id }
          action = "Updated"
          await setCorpus(item)
        }

        showHUD(`${action} ${values.title}!`)
        textFieldRef.current?.reset()
        filePickerRef.current?.reset()
        popToRoot()

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
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        value={title}
        title="Title"
        onChange={setTitle}
      />
      <Form.FilePicker
        id="folder"
        value={folder}
        title="Folder"
        onChange={setFolder}
        allowMultipleSelection={false}
        canChooseDirectories
        canChooseFiles={false}
      />
    </Form>
  )
}
