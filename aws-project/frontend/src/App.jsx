import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useEffect, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

const App = () => {
 const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");

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

    bindingRef.current?.destroy?.();
    providerRef.current?.destroy?.();

    const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc, {});
    providerRef.current = provider;

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
    bindingRef.current = binding;
  };

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="p-2 rounded-lg bg-gray-800 text-white outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="p-2 rounded-lg bg-amber-50 text-gray-950 font-bold dynamic-btn"
            onClick={() => {
              if (inputValue.trim()) {
                setUsername(inputValue.trim()); 
              }
            }}
          >
            Join
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-amber-50 rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-950">Users</h2>
        <p className="mt-2 text-sm text-gray-700">Logged in as: <strong>{username}</strong></p>
      </aside>

      <section className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// start coding here..."
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
};

export default App;
