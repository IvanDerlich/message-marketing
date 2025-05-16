import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FileUploader } from "./FileUploader";
import { FILE_ERRORS } from "./constants";

describe("FileUploader", () => {
  it("renders file input", () => {
    render(<FileUploader />);
    expect(screen.getByTestId("file-input-label")).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  it("calls onFileSelect when valid file is selected", () => {
    const onFileSelect = jest.fn();
    render(<FileUploader onFileSelect={onFileSelect} />);

    const file = new File([""], "test.gxr", {
      type: "application/octet-stream",
    });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it("displays filename and allows unselecting", () => {
    render(<FileUploader />);

    const file = new File([""], "test.gxr", {
      type: "application/octet-stream",
    });
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("test.gxr")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("remove-file-button"));

    expect(screen.queryByText("test.gxr")).not.toBeInTheDocument();
    expect(input.value).toBe("");
  });

  describe("file validation", () => {
    it("shows error for non-GXR file", () => {
      render(<FileUploader />);

      const file = new File([""], "test.txt", {
        type: "text/plain",
      });
      const input = screen.getByTestId("file-input");
      fireEvent.change(input, { target: { files: [file] } });

      expect(screen.getByRole("alert")).toHaveTextContent(
        FILE_ERRORS.INVALID_TYPE
      );
    });

    it("replaces existing file when new file is selected", () => {
      render(<FileUploader />);

      const firstFile = new File([""], "first.gxr", {
        type: "application/octet-stream",
      });
      const input = screen.getByTestId("file-input") as HTMLInputElement;
      fireEvent.change(input, { target: { files: [firstFile] } });

      expect(screen.getByText("first.gxr")).toBeInTheDocument();

      const secondFile = new File([""], "second.gxr", {
        type: "application/octet-stream",
      });
      fireEvent.change(input, { target: { files: [secondFile] } });

      expect(screen.queryByText("first.gxr")).not.toBeInTheDocument();
      expect(screen.getByText("second.gxr")).toBeInTheDocument();
    });

    describe("file size validation", () => {
      it("shows error for file larger than default max size (5MB)", () => {
        render(<FileUploader />);

        const largeFile = new File(
          [new ArrayBuffer(6 * 1024 * 1024)],
          "large.gxr"
        );
        const input = screen.getByTestId("file-input");
        fireEvent.change(input, { target: { files: [largeFile] } });

        expect(screen.getByRole("alert")).toHaveTextContent(
          "El archivo debe ser menor a 5MB"
        );
      });

      it("shows error for file larger than custom max size (2MB)", () => {
        render(<FileUploader maxFileSize={2} />);

        const largeFile = new File(
          [new ArrayBuffer(3 * 1024 * 1024)],
          "large.gxr"
        );
        const input = screen.getByTestId("file-input");
        fireEvent.change(input, { target: { files: [largeFile] } });

        expect(screen.getByRole("alert")).toHaveTextContent(
          "El archivo debe ser menor a 2MB"
        );
      });

      it("accepts file smaller than custom max size (10MB)", () => {
        const onFileSelect = jest.fn();
        render(<FileUploader maxFileSize={10} onFileSelect={onFileSelect} />);

        const file = new File([new ArrayBuffer(7 * 1024 * 1024)], "test.gxr");
        const input = screen.getByTestId("file-input");
        fireEvent.change(input, { target: { files: [file] } });

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(onFileSelect).toHaveBeenCalledWith(file);
      });
    });

    it("clears error when selecting valid file after error", () => {
      render(<FileUploader />);

      const invalidFile = new File([""], "test.txt", {
        type: "text/plain",
      });
      const input = screen.getByTestId("file-input");
      fireEvent.change(input, { target: { files: [invalidFile] } });

      expect(screen.getByRole("alert")).toHaveTextContent(
        FILE_ERRORS.INVALID_TYPE
      );

      const validFile = new File([""], "test.gxr", {
        type: "application/octet-stream",
      });
      fireEvent.change(input, { target: { files: [validFile] } });

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  // @TODO: Add more tests:
  // - Test file type validation
  // - Test file size validation
  // - Test error states
  // - Test multiple file selection
  // - Test drag and drop
});
