/**
 * IndexedDB persistence layer for DiagramDocument.
 * Uses the `idb` wrapper for a clean promise-based API.
 */

import { openDB, type IDBPDatabase } from 'idb'
import type { DiagramDocument } from '../store/types'

const DB_NAME = 'architecturesvg'
const DB_VERSION = 1
const STORE_NAME = 'documents'
const DOC_KEY = 'current'

type ArchDB = {
  documents: {
    key: string
    value: DiagramDocument
  }
}

let dbPromise: Promise<IDBPDatabase<ArchDB>> | null = null

function getDB(): Promise<IDBPDatabase<ArchDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ArchDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      },
    })
  }
  return dbPromise
}

/** Persist a document snapshot to IndexedDB. */
export async function saveDocument(doc: DiagramDocument): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, doc, DOC_KEY)
}

/** Load the last persisted document, or null if none exists. */
export async function loadDocument(): Promise<DiagramDocument | null> {
  const db = await getDB()
  const doc = await db.get(STORE_NAME, DOC_KEY)
  return doc ?? null
}
