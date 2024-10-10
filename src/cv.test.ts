import { CV } from "./model.ts";
import { cv } from "./cv.ts";

Deno.test(`cv is compliant with the CV type / interface`, () => {
  const _test: CV = cv;
});
