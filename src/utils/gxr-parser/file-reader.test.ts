import { fileReader } from "./file-reader";
import fs from "fs";
import path from "path";

describe("readFile", () => {
  it("should read a file as ArrayBuffer", async () => {
    // Create a sample file
    const content = "test content";
    const file = new File([content], "test.txt", { type: "text/plain" });

    const buffer = await fileReader(file);

    // Convert buffer to text using the same method as file-reader
    const array = new Uint8Array(buffer);
    const text = Array.from(array)
      .map((byte) => String.fromCharCode(byte))
      .join("");
    console.log("Text:", text);
    expect(text).toBe(content);
  });

  it("should read a GXR file", async () => {
    const filePath = path.join(
      process.cwd(),
      "src",
      "__fixtures__",
      "gxr-files",
      "formated-content.gxr"
    );
    const fileContent = fs.readFileSync(filePath);
    const file = new File([fileContent], "formated-content.gxr", {
      type: "application/octet-stream",
    });

    const buffer = await fileReader(file);
    const array = new Uint8Array(buffer);
    const text = Array.from(array)
      .map((byte) => String.fromCharCode(byte))
      .join("");

    const expectedContent =
      "Sample GRX content\nColumn1 Column2 Column3\nData1   Data2   Data3";
    expect(text).toBe(expectedContent);
  });

  it.only("should read unformatted GXR file (first few lines)", async () => {
    const filePath = path.join(
      process.cwd(),
      "src",
      "__fixtures__",
      "gxr-files",
      "unformated-content.gxr"
    );
    const fileContent = fs.readFileSync(filePath);
    const file = new File([fileContent], "unformated-content.gxr", {
      type: "application/octet-stream",
    });

    const buffer = await fileReader(file);
    const array = new Uint8Array(buffer);
    
    // Get first 100 bytes and convert to hex
    const firstBytes = array.slice(0, 100);
    const bytesHex = Array.from(firstBytes).map(b => '0x' + b.toString(16).padStart(2, '0'));
    
    expect(bytesHex).toEqual([
      '0x1e', '0x00', '0x00', '0x00', '0x00', '0x00', '0xff',
      '0xff', '0x00', '0x00', '0x0e', '0x00', '0x43', '0x52',
      '0x65', '0x70', '0x6f', '0x72', '0x74', '0x42', '0x75',
      '0x69', '0x6c', '0x64', '0x65', '0x72', '0x14', '0x00',
      '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00',
      '0x00', '0x00', '0x00', '0xf6', '0x02', '0x00', '0x00',
      '0x60', '0x00', '0x00', '0x00', '0x60', '0x00', '0x00',
      '0x00', '0x44', '0x04', '0x00', '0x00', '0x01', '0x00',
      '0x00', '0x00', '0x09', '0x00', '0x00', '0x00', '0xea',
      '0x0a', '0x00', '0x00', '0x6f', '0x08', '0x00', '0x00',
      '0x00', '0x00', '0x00', '0x00', '0x01', '0x00', '0x00',
      '0x00', '0x07', '0x00', '0x00', '0x00', '0x58', '0x02',
      '0x00', '0x00', '0x01', '0x00', '0x00', '0x00', '0x01',
      '0x00', '0x00', '0x00', '0x09', '0x47', '0x58', '0x50',
      '0x52', '0x4e'
    ]);
  });
});
