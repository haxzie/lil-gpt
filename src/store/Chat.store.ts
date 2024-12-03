import { create } from "zustand";
import { ChatRole, ChatStoreState } from "./Chat.types";
import { v4 as uuid } from "uuid";
import { API_KEY_STORAGE_KEY } from "../utils/constants";

const initalState = {
  messages: {},
  apiKey: localStorage.getItem(API_KEY_STORAGE_KEY) || "",
};

const useChatStore = create<ChatStoreState>((set) => ({
  // The initial state of the store
  ...initalState,

  saveApiKey: (key: string) => {
    set({ apiKey: key });
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  },
  /**
   * Add a new message to the store
   * @param role ChatRole
   * @param content string
   * */
  addMessage: (role: ChatRole, content: string) => {
    const messageId = uuid();
    set((state) => ({
      messages: {
        ...state.messages,
        [messageId]: {
          id: messageId,
          role,
          content,
        },
      },
    }));
    return messageId;
  },

  /**
   * Update a message in the store
   */
  updateMessage: (id: string, content: string) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [id]: {
          ...state.messages[id],
          content,
        },
      },
    }));
  },
  /**
   * Clear all messages from the store
   * */
  clearMessages: () => {
    set({ messages: {} });
  },
}));

export default useChatStore;
