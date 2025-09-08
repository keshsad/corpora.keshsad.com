import { Action, ActionPanel, Icon, launchCommand, LaunchType, List } from "@raycast/api"
import { useEffect, useState } from "react"
import { deleteCorpus, getCorpora, getCorpus, nukeCorpora, printLocalStorage } from "./helpers/storage"
import { Corpus, CorpusInput } from "./types"
import FetchContextForm from "./fetch"
import UpdateContextForm from "./update"
import { UUID } from "crypto"
import CorpusForm from "./form"

function Dropdown() {
  return (
    <List.Dropdown tooltip="Filter">
      <List.Dropdown.Item title="All" value="All" />
      <List.Dropdown.Section title="Types">
        <List.Dropdown.Item title="Codebase" value="Codebase" />
        <List.Dropdown.Item title="Markdown" value="Markdown" />
      </List.Dropdown.Section>
    </List.Dropdown>
  )
}

export default function ViewCorporaList() {
  const [searchText, setSearchText] = useState("")
  const [items, setItems] = useState<Corpus[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => { loadItems() }, [])

  const loadItems = async () => {
    setIsLoading(true)
    try {
      const items = await getCorpora()
      if (items) setItems(items)
    } catch { console.error("Failed to fetch Corpora") }
    setIsLoading(false)
  }

  const filteredItems = items.filter(item => (
    item.title.toLowerCase().includes(searchText.toLowerCase())
  ))

  return (
    <List
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarAccessory={<Dropdown />}
      searchBarPlaceholder="Search..."
    >
      {(searchText === "" && items.length === 0)
        ? <List.EmptyView icon="📂" title="No results!" description="Try adding a New Corpus..." actions={emptyActions} />
        : (searchText !== "" && filteredItems.length === 0)
          ? <List.EmptyView icon="😩" title="No results!" description="Try a different search..." actions={emptyActions} />
          : <List.Section title="Results" subtitle={filteredItems.length.toString()}>
            {filteredItems.map(item => <List.Item key={item.id} title={item.title} actions={actions(item, loadItems)} />)}
          </List.Section>
      }
    </List>
  )
}

const newCorpus = async () => {
  await launchCommand({
    name: "form",
    extensionName: "extendo",
    ownerOrAuthorName: "rishi-sadanandan",
    type: LaunchType.UserInitiated,
  })
}

const editCorpus = async (itemId: UUID) => {
  const corpus: Corpus | undefined = await getCorpus(itemId)
  let corpusInput
  if (!corpus) {
    corpusInput = {
    }
    await launchCommand({
      name: "form",
      extensionName: "extendo",
      ownerOrAuthorName: "rishi-sadanandan",
      type: LaunchType.UserInitiated,
      //context: { ...corpusInput }
    })
  }

  const emptyActions = (
    <ActionPanel>
      <Action title="New Corpus" icon={Icon.PlusTopRightSquare} onAction={async () => newCorpus()} />
    </ActionPanel>
  )

  const actions = (item: Corpus, reload: () => void) => {
    return (
      <ActionPanel title={item.title}>
        <Action.CopyToClipboard title="Copy Context" content={"clipboard copy of all markdown context documents"} />
        <Action.ShowInFinder title="Show in Finder" path={item.folder} />
        <ActionPanel.Section title="Context">
          <Action title="Print Local Storage"
            icon={Icon.Box}
            onAction={async () => await printLocalStorage()}
            shortcut={{ macOS: { modifiers: ["cmd", "shift"], key: "return" }, windows: { modifiers: ["ctrl", "shift"], key: "return" } }}
          />
          <Action.Push
            title="Fetch"
            target={<FetchContextForm />}
            shortcut={{ macOS: { modifiers: ["cmd"], key: "f" }, windows: { modifiers: ["ctrl"], key: "f" } }}
          />
          <Action.Push
            title="Update"
            target={<UpdateContextForm />}
            shortcut={{ macOS: { modifiers: ["cmd"], key: "u" }, windows: { modifiers: ["ctrl"], key: "u" } }}
          />
        </ActionPanel.Section>
        <ActionPanel.Section>
          <Action.Push
            title="Edit Corpus"
            icon={Icon.Pencil}
            target={<CorpusForm launchType={LaunchType.UserInitiated} launchContext={item} />}
            //onAction={async () => {
            //  editCorpus(item.id)
            //  reload()
            //}}
            shortcut={{ macOS: { modifiers: ["cmd"], key: "e" }, windows: { modifiers: ["ctrl"], key: "e" } }}
          />
          <Action
            title="New Corpus"
            icon={Icon.PlusTopRightSquare}
            onAction={async () => {
              newCorpus()
              reload()
            }}
            shortcut={{ macOS: { modifiers: ["cmd"], key: "n" }, windows: { modifiers: ["ctrl"], key: "n" } }}
          />
          <Action
            title="Delete Corpus"
            icon={Icon.XMarkTopRightSquare}
            style={Action.Style.Destructive}
            onAction={async () => {
              deleteCorpus(item.id)
              reload()
            }}
            shortcut={{ macOS: { modifiers: [], key: "backspace" }, windows: { modifiers: [], key: "backspace" } }}
          />
          <Action
            title="Nuke Corpora"
            icon={Icon.Trash}
            style={Action.Style.Destructive}
            onAction={async () => {
              nukeCorpora()
              reload()
            }}
            shortcut={{ macOS: { modifiers: ["cmd"], key: "backspace" }, windows: { modifiers: ["ctrl"], key: "backspace" } }}
          />
        </ActionPanel.Section>
      </ActionPanel>
    )
  }
