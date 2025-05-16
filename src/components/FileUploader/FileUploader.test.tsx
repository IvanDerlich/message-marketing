import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FileUploader } from "./FileUploader";
import { FILE_ERRORS } from "./constants";
import { siteConfig } from "@/config/site";

describe("FileUploader", () => {
  it("renders file input", () => {
    render(<FileUploader />);
    expect(screen.getByTestId("file-input-label")).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  it("calls onFileSelect when valid file is selected", async () => {
    const onFileSelect = jest.fn();
    render(<FileUploader onFileSelect={onFileSelect} />);

    const file = new File([""], "test.gxr", {
      type: "application/octet-stream",
    });
    const input = screen.getByTestId("file-input");
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it("displays filename and allows unselecting", async () => {
    render(<FileUploader />);

    const file = new File([""], "test.gxr", {
      type: "application/octet-stream",
    });
    const input = screen.getByTestId("file-input") as HTMLInputElement;
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    expect(screen.getByText("test.gxr")).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(screen.getByTestId("remove-file-button"));
    });
    expect(screen.queryByText("test.gxr")).not.toBeInTheDocument();
    expect(input.value).toBe("");
  });

  describe("file validation", () => {
    it("shows error for non-GXR file", async () => {
      render(<FileUploader />);
      
      const file = new File([""], "test.txt", { type: "text/plain" });
      const input = screen.getByTestId("file-input");
      
      await act(async () => {
        fireEvent.change(input, { target: { files: [file] } });
      });
      
      await waitFor(() => {
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toHaveTextContent(FILE_ERRORS.INVALID_TYPE);
      });
    });

    it("replaces existing file when new file is selected", async () => {
      render(<FileUploader />);
      
      const firstFile = new File([""], "first.gxr", {
        type: "application/octet-stream",
      });
      const input = screen.getByTestId("file-input") as HTMLInputElement;
      
      await act(async () => {
        fireEvent.change(input, { target: { files: [firstFile] } });
      });
      expect(screen.getByText("first.gxr")).toBeInTheDocument();
      
      const secondFile = new File([""], "second.gxr", {
        type: "application/octet-stream",
      });
      
      await act(async () => {
        fireEvent.change(input, { target: { files: [secondFile] } });
      });
      expect(screen.queryByText("first.gxr")).not.toBeInTheDocument();
      expect(screen.getByText("second.gxr")).toBeInTheDocument();
    });

    describe("file size validation", () => {
      it("shows error for file larger than default max size (5MB)", async () => {
        render(<FileUploader />);
        
        const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.gxr");
        const input = screen.getByTestId("file-input");
        
        await act(async () => {
          fireEvent.change(input, { target: { files: [largeFile] } });
        });
        
        await waitFor(() => {
          expect(screen.getByTestId("error-message")).toBeInTheDocument();
          expect(screen.getByTestId("error-message")).toHaveTextContent("El archivo debe ser menor a 2MB");
        });
      });

      it("shows error for file larger than custom max size (2MB)", async () => {
        render(<FileUploader maxFileSize={2} />);
        
        const largeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], "large.gxr");
        const input = screen.getByTestId("file-input");
        
        await act(async () => {
          fireEvent.change(input, { target: { files: [largeFile] } });
        });
        
        await waitFor(() => {
          expect(screen.getByTestId("error-message")).toBeInTheDocument();
          expect(screen.getByTestId("error-message")).toHaveTextContent("El archivo debe ser menor a 2MB");
        });
      });

      it("accepts file smaller than custom max size (10MB)", async () => {
        const onFileSelect = jest.fn();
        render(<FileUploader maxFileSize={10} onFileSelect={onFileSelect} />);
        
        const file = new File([new ArrayBuffer(7 * 1024 * 1024)], "test.gxr");
        const input = screen.getByTestId("file-input");
        
        await act(async () => {
          fireEvent.change(input, { target: { files: [file] } });
        });
        expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
        expect(onFileSelect).toHaveBeenCalledWith(file);
      });
    });

    it("clears error when selecting valid file after error", async () => {
      render(<FileUploader />);
      
      const invalidFile = new File([""], "test.txt", {
        type: "text/plain",
      });
      const input = screen.getByTestId("file-input");
      
      await act(async () => {
        fireEvent.change(input, { target: { files: [invalidFile] } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByTestId("error-message")).toHaveTextContent(FILE_ERRORS.INVALID_TYPE);
      });
      
      const validFile = new File([""], "test.gxr", {
        type: "application/octet-stream",
      });
      
      await act(async () => {
        fireEvent.change(input, { target: { files: [validFile] } });
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
      });
    });
  });

  describe("filename validation", () => {
    it("shows error for file with name longer than maximum length", async () => {
      render(<FileUploader />);
      
      const longFileName = "a".repeat(siteConfig.upload.maxFileNameLength + 1) + ".gxr";
      const file = new File([""], longFileName, {
        type: "application/octet-stream",
      });
      const input = screen.getByTestId("file-input");
      
      await act(async () => {
        fireEvent.change(input, { target: { files: [file] } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByTestId("error-message")).toHaveTextContent(FILE_ERRORS.FILENAME_TOO_LONG);
      });
    });

    it("accepts file with name equal to maximum length", async () => {
      const onFileSelect = jest.fn();
      render(<FileUploader onFileSelect={onFileSelect} />);
      
      const fileName = "a".repeat(siteConfig.upload.maxFileNameLength - 4) + ".gxr";
      const file = new File([""], fileName, {
        type: "application/octet-stream",
      });
      const input = screen.getByTestId("file-input");
      
      await act(async () => {
        fireEvent.change(input, { target: { files: [file] } });
      });
      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
      expect(onFileSelect).toHaveBeenCalledWith(file);
    });

    it("shows tooltip with full filename on hover", async () => {
      render(<FileUploader />);
      
      const fileName = "very-long-filename-that-might-be-truncated.gxr";
      const file = new File([""], fileName, {
        type: "application/octet-stream",
      });
      const input = screen.getByTestId("file-input");
      
      await act(async () => {
        fireEvent.change(input, { target: { files: [file] } });
      });
      const fileNameElement = screen.getByTestId("file-name");
      expect(fileNameElement).toHaveAttribute("data-tooltip", fileName);
    });
  });

  it("shows loading state while processing file", async () => {
    const onFileSelect = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<FileUploader onFileSelect={onFileSelect} />);

    const file = new File([""], "test.gxr", {
      type: "application/octet-stream",
    });
    const input = screen.getByTestId("file-input");
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(screen.queryByTestId("remove-file-button"))?.toBeDisabled();
    
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
    
    expect(input).not.toBeDisabled();
  });

  // @TODO: Add more tests:
  // - Test error states
  // - Test multiple file selection
  // - Test drag and drop
});
