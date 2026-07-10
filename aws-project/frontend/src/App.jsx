import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

const App = () => {
  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy?.();
      providerRef.current?.destroy?.();
      ydoc.destroy();
    };
  }, [ydoc]);


  const handleMount = (editor) => {
    editorRef.current = editor;

    // Clean up previous connection if editor remounts (e.g. React StrictMode)
    bindingRef.current?.destroy?.();
    providerRef.current?.destroy?.();

    // 4th arg is required: library destructures { autoConnect, ... } from it
    const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc,{});
    providerRef.current = provider;

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
    bindingRef.current = binding;
  };

  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-amber-50 rounded-lg"></aside>

      <section className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
};

export default App;
