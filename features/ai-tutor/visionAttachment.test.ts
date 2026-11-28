import {describe,it,expect} from "vitest";
import {attachmentKind,visionAllowed,MAX_IMAGE_BYTES} from "./visionAttachment";
describe("attachment screening",()=>{
 it("recognizes supported signatures but rejects mismatched declarations",()=>{
 const png=new Uint8Array([137,80,78,71,13,10,26,10]);
 expect(attachmentKind(png,"image/png")).toBe("image");
 expect(attachmentKind(png,"application/pdf")).toBeNull();
 expect(attachmentKind(new TextEncoder().encode("%PDF-1.7"),"application/pdf")).toBe("pdf");
 expect(attachmentKind(new Uint8Array(MAX_IMAGE_BYTES+1),"image/png")).toBeNull();
 });
 it("requires all activation gates",()=>{
 const s={environment:"preview",branch:"feature/unified-ai-tutor",enabled:true,accessVerified:true,budgetApproved:true};
 expect(visionAllowed(s)).toBe(true);
 expect(visionAllowed({...s,environment:"production"})).toBe(false);
 expect(visionAllowed({...s,budgetApproved:false})).toBe(false);
 });
});
