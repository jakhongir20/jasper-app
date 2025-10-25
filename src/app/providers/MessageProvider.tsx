import type { MessageInstance } from "antd/es/message/interface";
import { createContext, ReactNode, useContext } from "react";
import { message } from "antd";

export const MessageContext = createContext<MessageInstance | null>(null);

const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messageApi, messageContextHolder] = message.useMessage();

  return (
    <>
      {messageContextHolder}
      <MessageContext.Provider value={messageApi}>
        {children}
      </MessageContext.Provider>
    </>
  );
};

export const useGlobalToast = (): MessageInstance => {
  const messageApi = useContext(MessageContext);
  if (messageApi === null) {
    throw new Error("useToast must be used within a MessageProvider");
  }
  return messageApi;
};

export default MessageProvider;
