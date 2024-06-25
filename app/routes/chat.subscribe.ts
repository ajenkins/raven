import type { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";

import { emitter } from "../emitter.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(value: string) {
      console.log("sending new message");
      send({ event: "message", data: value });
    }

    emitter.on("message", handle);

    return function clear() {
      emitter.off("message", handle);
    };
  });
}
