import { describe, expect, it } from "vitest";
import { googleFormLinks } from "./googleForm";

describe("Google Forms responder links", () => {
  it("converts a responder link to an embed while preserving prefilled values", () => {
    const links = googleFormLinks("https://docs.google.com/forms/d/e/FORM_123/viewform?entry.1=Mai&embedded=false#section");
    expect(links?.embedUrl).toBe("https://docs.google.com/forms/d/e/FORM_123/viewform?entry.1=Mai&embedded=true");
    expect(links?.openUrl).toBe("https://docs.google.com/forms/d/e/FORM_123/viewform?entry.1=Mai");
  });

  it("accepts the alternate full responder path", () => {
    expect(googleFormLinks("https://docs.google.com/forms/d/FORM_123/viewform")?.embedUrl)
      .toBe("https://docs.google.com/forms/d/FORM_123/viewform?embedded=true");
  });

  it.each([
    "", "not a URL", "javascript:alert(1)",
    "http://docs.google.com/forms/d/e/FORM/viewform",
    "https://docs.google.com.evil.example/forms/d/e/FORM/viewform",
    "https://user:password@docs.google.com/forms/d/e/FORM/viewform",
    "https://docs.google.com/forms/d/FORM/edit",
    "https://docs.google.com/forms/d/e/FORM/formResponse",
    "https://forms.gle/short-link",
  ])("does not embed an invalid or non-responder URL: %s", url => {
    expect(googleFormLinks(url)).toBeNull();
  });
});
