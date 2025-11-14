"use client";

import { useState } from "react";

import type { EnterpriseDocument } from "../(dashboard)/empreendimentos/data";

interface EnterpriseDocumentsUploaderProps {
  value: EnterpriseDocument[];
  onChange: (documents: EnterpriseDocument[]) => void;
}

export function EnterpriseDocumentsUploader({ value, onChange }: EnterpriseDocumentsUploaderProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [owner, setOwner] = useState("");

  function resetFields() {
    setName("");
    setCategory("");
    setOwner("");
  }

  function handleAddDocument() {
    if (!name.trim() || !category.trim()) {
      return;
    }

    const newDocument: EnterpriseDocument = {
      id: `doc-${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim(),
      category: category.trim(),
      owner: owner.trim() || "Equipe mockada",
      uploadedAt: new Date().toISOString().slice(0, 10),
    };

    onChange([newDocument, ...value]);
    resetFields();
  }

  function handleRemoveDocument(documentId: string) {
    onChange(value.filter((document) => document.id !== documentId));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <label htmlFor="enterprise-document-name" className="text-sm font-medium text-[var(--color-text)]">
            Nome do documento
          </label>
          <input
            id="enterprise-document-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="Memorial, licença, relatório..."
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-document-category" className="text-sm font-medium text-[var(--color-text)]">
            Categoria
          </label>
          <input
            id="enterprise-document-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="Compliance, Projeto, Ambiental"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-document-owner" className="text-sm font-medium text-[var(--color-text)]">
            Responsável
          </label>
          <input
            id="enterprise-document-owner"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="Nome do responsável"
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={resetFields}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
        >
          Limpar
        </button>
        <button
          type="button"
          onClick={handleAddDocument}
          className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          Simular upload
        </button>
      </div>

      <div className="space-y-3">
        {value.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
            Nenhum documento adicionado ainda. Simule um upload para visualizar o comportamento da lista.
          </p>
        )}
        {value.map((document) => (
          <div
            key={document.id}
            className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[var(--color-text)]">{document.name}</p>
              <p className="text-xs">{document.category} • Responsável: {document.owner}</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-[var(--color-text-muted)]">
                Upload {new Date(document.uploadedAt).toLocaleDateString("pt-BR")}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveDocument(document.id)}
                className="rounded-full border border-[var(--color-border)] px-3 py-1 font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
