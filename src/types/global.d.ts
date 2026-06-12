import { DiagramDocument } from '../store/types'

declare global {
  interface Window {
    __diagram: DiagramDocument
  }
}
