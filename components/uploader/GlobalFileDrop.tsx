"use client";

import { validateFile } from "@/src/lib/files";
import { savePendingFile } from "@/src/lib/pendingFile";
import { useRouter } from "next/navigation";
import { DragEvent, useEffect, useRef } from "react";

export function GlobalFileDrop() {
  const router = useRouter();
  const dropTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    function handleDragOver(event: DragEvent) {
      // Only prevent default if files are being dragged
      if (event.dataTransfer.types.includes("Files")) {
        event.preventDefault();
        document.body.classList.add("global-drag-active");
      }
    }

    function handleDragLeave(event: DragEvent) {
      // Clear timeout if exists
      if (dropTimeoutRef.current) {
        clearTimeout(dropTimeoutRef.current);
      }

      // Use a small timeout to prevent flickering when dragging over child elements
      dropTimeoutRef.current = setTimeout(() => {
        document.body.classList.remove("global-drag-active");
      }, 50);
    }

    function handleDrop(event: DragEvent) {
      event.preventDefault();
      document.body.classList.remove("global-drag-active");

      if (dropTimeoutRef.current) {
        clearTimeout(dropTimeoutRef.current);
      }

      // Prevent multiple simultaneous drops
      if (isProcessingRef.current) return;

      const files = event.dataTransfer.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      isProcessingRef.current = true;

      const validation = validateFile(file);
      if (!validation.ok) {
        // If validation fails, do nothing (the user will need to use the explicit drop zone)
        isProcessingRef.current = false;
        return;
      }

      // Save the file and navigate to viewer
      void (async () => {
        try {
          await savePendingFile(file);
          router.push("/view");
        } finally {
          isProcessingRef.current = false;
        }
      })();
    }

    // Add event listeners to document
    document.addEventListener("dragover", handleDragOver as EventListener);
    document.addEventListener("dragleave", handleDragLeave as EventListener);
    document.addEventListener("drop", handleDrop as EventListener);

    // Cleanup
    return () => {
      document.removeEventListener("dragover", handleDragOver as EventListener);
      document.removeEventListener("dragleave", handleDragLeave as EventListener);
      document.removeEventListener("drop", handleDrop as EventListener);
      if (dropTimeoutRef.current) {
        clearTimeout(dropTimeoutRef.current);
      }
      document.body.classList.remove("global-drag-active");
    };
  }, [router]);

  return null;
}
