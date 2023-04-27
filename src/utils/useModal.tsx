import { useCallback, useState } from "react";

export const useModal = () => {
  const [visible, setVisible] = useState(false);
  //   const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const show = useCallback(
    (content) => {
      setVisible(true);
      setContent(content);
    },
    [visible]
  );
  const close = useCallback(() => setVisible(false), [visible]);

  return { visible, show, close, content };
};
