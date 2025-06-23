// https://github.com/cloudflare/partykit/tree/main/fixtures/tiptap-yjs
import { routePartykitRequest } from "partyserver";
import { YServer } from "y-partyserver";
import * as Y from "yjs";

import type { CallbackOptions } from "y-partyserver";

type Env = {
  Document: DurableObjectNamespace<YServer>;
};

export class Document extends YServer<Env> {
  // This is optional, but it allows you to configure the callback options
  static callbackOptions: CallbackOptions = {
    debounceWait: 1000,
    debounceMaxWait: 10000,
    timeout: 10000,
  };
  async onStart() {
    this.ctx.storage.sql.exec(
      "CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, content BLOB)"
    );

    return super.onStart();
  }
  async onLoad() {
    // load a document from a database, or some remote resource
    // and apply it on to the Yjs document instance at `this.document`
    const document = [
      ...this.ctx.storage.sql.exec(
        "SELECT * FROM documents WHERE id = ? LIMIT 1",
        this.name
      ),
    ][0];

    if (document) {
      Y.applyUpdate(
        this.document,
        new Uint8Array(document.content as ArrayBuffer)
      );
    }
    return;
  }

  async onSave() {
    // called every few seconds after edits, and when the room empties
    // you can use this to write to a database or some external storage
    const update = Y.encodeStateAsUpdate(this.document);
    this.ctx.storage.sql.exec(
      "INSERT OR REPLACE INTO documents (id, content) VALUES (?, ?)",
      this.name,
      update
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
