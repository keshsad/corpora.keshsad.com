import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { printLocalStorage } from "./helpers/storage";
import { UUID } from "crypto";
import { PathLike } from "fs";

type Context = {
  id: UUID
  title: string
  path: PathLike
  markdown: string
  metadata: { [key: string]: object }
}

export default function ViewDocuments() {
  const [searchText, setSearchText] = useState("")
  const [items, setItems] = useState<Context[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { loadItems() }, [])

  const loadItems = async () => {
    setIsLoading(true)
    try {
      //const items = await getDocuments()
      if (items) setItems([])
    } catch { console.error("Failed to fetch Documents") }
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

const newDocument = async () => {
  console.log("newDocument")
}

const editDocument = async (id: UUID) => {
  console.log("editDocument", id)
}

const deleteDocument = async (id: UUID) => {
  console.log("deleteDocument", id)
}

const nukeDocuments = async () => {
  console.log("nukeDocuments")
}

const emptyActions = (
  <ActionPanel>
    <Action title="New Document" icon={Icon.PlusTopRightSquare} onAction={async () => newDocument()} />
    <Action title="Print Local Storage"
      icon={Icon.Box}
      onAction={async () => await printLocalStorage()}
      shortcut={{ macOS: { modifiers: ["cmd", "shift"], key: "return" }, windows: { modifiers: ["ctrl", "shift"], key: "return" } }}
    />
  </ActionPanel>
)

const actions = (item: Context, reload: () => void) => {
  return (
    <ActionPanel title={item.title}>
      <Action.CopyToClipboard title="Copy Markdown" content={item.markdown} />
      <Action.ShowInFinder title="Show in Finder" path={item.path} />
      <ActionPanel.Section>
        <Action
          title="New Document"
          icon={Icon.PlusTopRightSquare}
          onAction={async () => {
            await newDocument()
            reload()
          }}
          shortcut={{ macOS: { modifiers: ["cmd"], key: "n" }, windows: { modifiers: ["ctrl"], key: "n" } }}
        />
        <Action
          title="Edit Document"
          icon={Icon.Pencil}
          onAction={async () => {
            await editDocument(item.id)
            reload()
          }}
          shortcut={{ macOS: { modifiers: ["cmd"], key: "e" }, windows: { modifiers: ["ctrl"], key: "e" } }}
        />
        <Action
          title="Delete Document"
          icon={Icon.XMarkTopRightSquare}
          style={Action.Style.Destructive}
          onAction={async () => {
            await deleteDocument(item.id)
            reload()
          }}
          shortcut={{ macOS: { modifiers: ["cmd"], key: "d" }, windows: { modifiers: ["ctrl"], key: "d" } }}
        />
        <Action
          title="Nuke Documents"
          icon={Icon.Trash}
          style={Action.Style.Destructive}
          onAction={async () => {
            await nukeDocuments()
            reload()
          }}
          shortcut={{ macOS: { modifiers: ["cmd", "shift"], key: "d" }, windows: { modifiers: ["ctrl", "shift"], key: "d" } }}
        />
      </ActionPanel.Section>
      <Action title="Print Local Storage"
        icon={Icon.Box}
        onAction={async () => await printLocalStorage()}
        shortcut={{ macOS: { modifiers: ["cmd", "shift"], key: "return" }, windows: { modifiers: ["ctrl", "shift"], key: "return" } }}
      />
    </ActionPanel>
  )
}
