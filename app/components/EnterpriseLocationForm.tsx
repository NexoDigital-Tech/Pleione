"use client";

import type { ChangeEvent } from "react";

import type { EnterpriseLocation } from "../(dashboard)/empreendimentos/data";

interface EnterpriseLocationFormProps {
  value: EnterpriseLocation;
  onChange: (value: EnterpriseLocation) => void;
}

export function EnterpriseLocationForm({ value, onChange }: EnterpriseLocationFormProps) {
  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value: inputValue } = event.target;
    onChange({ ...value, [name]: inputValue });
  }

  function handleCoordinateChange(field: 'latitude' | 'longitude') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value: coordinate } = event.target;
      onChange({
        ...value,
        [field]: coordinate === '' ? undefined : Number(coordinate),
      });
    };
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="enterprise-address" className="text-sm font-medium text-[color:var(--color-text)]">
            Endereço
          </label>
          <input
            id="enterprise-address"
            name="address"
            value={value.address}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Rua das Acácias, 120"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-area" className="text-sm font-medium text-[color:var(--color-text)]">
            Área total
          </label>
          <input
            id="enterprise-area"
            name="area"
            value={value.area ?? ''}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="52.000 m²"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <label htmlFor="enterprise-city" className="text-sm font-medium text-[color:var(--color-text)]">
            Cidade
          </label>
          <input
            id="enterprise-city"
            name="city"
            value={value.city}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="São Paulo"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-state" className="text-sm font-medium text-[color:var(--color-text)]">
            Estado
          </label>
          <input
            id="enterprise-state"
            name="state"
            value={value.state}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="SP"
            maxLength={2}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-postalCode" className="text-sm font-medium text-[color:var(--color-text)]">
            CEP
          </label>
          <input
            id="enterprise-postalCode"
            name="postalCode"
            value={value.postalCode}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="01000-000"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="enterprise-country" className="text-sm font-medium text-[color:var(--color-text)]">
            País
          </label>
          <input
            id="enterprise-country"
            name="country"
            value={value.country}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Brasil"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-referencePoints" className="text-sm font-medium text-[color:var(--color-text)]">
            Pontos de referência
          </label>
          <input
            id="enterprise-referencePoints"
            name="referencePoints"
            value={value.referencePoints ?? ''}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Próximo ao metrô"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="enterprise-latitude" className="text-sm font-medium text-[color:var(--color-text)]">
            Latitude
          </label>
          <input
            id="enterprise-latitude"
            name="latitude"
            type="number"
            step="any"
            value={value.latitude ?? ''}
            onChange={handleCoordinateChange('latitude')}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="-23.5505"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-longitude" className="text-sm font-medium text-[color:var(--color-text)]">
            Longitude
          </label>
          <input
            id="enterprise-longitude"
            name="longitude"
            type="number"
            step="any"
            value={value.longitude ?? ''}
            onChange={handleCoordinateChange('longitude')}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="-46.6333"
          />
        </div>
      </div>
    </div>
  );
}
