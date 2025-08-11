"use client"

import { useCallback } from "react"

export function useIndexedDB(dbName: string, version: number) {
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(dbName, version)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
          try {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains("apartments")) {
              db.createObjectStore("apartments", { keyPath: "id" })
            }
            if (!db.objectStoreNames.contains("cities")) {
              db.createObjectStore("cities", { keyPath: "name" })
            }
          } catch (upgradeError) {
            console.warn("IndexedDB upgrade failed:", upgradeError)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }, [dbName, version])

  const saveData = useCallback(
    async (storeName: string, data: any) => {
      try {
        const db = await openDB()
        const transaction = db.transaction([storeName], "readwrite")
        const store = transaction.objectStore(storeName)

        if (Array.isArray(data)) {
          for (const item of data) {
            await store.put(item)
          }
        } else {
          await store.put(data)
        }

        return new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve()
          transaction.onerror = () => reject(transaction.error)
        })
      } catch (error) {
        console.error("Error saving to IndexedDB:", error)
      }
    },
    [openDB],
  )

  const loadData = useCallback(
    async (storeName: string, key?: string) => {
      try {
        const db = await openDB()
        const transaction = db.transaction([storeName], "readonly")
        const store = transaction.objectStore(storeName)

        if (key) {
          const request = store.get(key)
          return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          })
        } else {
          const request = store.getAll()
          return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          })
        }
      } catch (error) {
        console.error("Error loading from IndexedDB:", error)
        return null
      }
    },
    [openDB],
  )

  return { saveData, loadData }
}
