"use client";

import { useEffect, useId, useState } from "react";
import type { FormEvent } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Minus,
  Moon,
  Plus,
  Route,
  Sun,
  X,
} from "lucide-react";
import type {
  NewStandaloneVisit,
  StandaloneVisitKind,
  StandaloneVisitRecord,
} from "@/types/travel";

type StandaloneVisitModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (visit: NewStandaloneVisit) => void;
};

type FormState = {
  place: string;
  placeType: StandaloneVisitRecord["placeType"];
  municipality: string;
  region: string;
  country: string;
  visitCount: number;
  visitKind: StandaloneVisitKind;
  period: string;
  nights: number;
  wantsToReturn: boolean;
  note: string;
};

const initialForm: FormState = {
  place: "",
  placeType: "Praia/localidade",
  municipality: "",
  region: "Ceará",
  country: "Brasil",
  visitCount: 1,
  visitKind: "day_trip",
  period: "",
  nights: 0,
  wantsToReturn: false,
  note: "",
};

const visitKinds: {
  id: StandaloneVisitKind;
  label: string;
  detail: string;
  icon: typeof Sun;
}[] = [
  { id: "day_trip", label: "Passeio de um dia", detail: "Sem pernoite", icon: Sun },
  { id: "overnight", label: "Com pernoite", detail: "Uma ou mais noites", icon: Moon },
  { id: "long_stay", label: "Estadia ou base", detail: "Período mais longo", icon: Clock3 },
];

export function StandaloneVisitModal({
  open,
  onClose,
  onSave,
}: StandaloneVisitModalProps) {
  const titleId = useId();
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setForm(initialForm);
        onClose();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function changeVisitKind(visitKind: StandaloneVisitKind) {
    setForm((current) => ({
      ...current,
      visitKind,
      nights: visitKind === "day_trip" ? 0 : Math.max(current.nights, 1),
    }));
  }

  function closeModal() {
    setForm(initialForm);
    onClose();
  }

  function submitVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave({
      place: form.place.trim(),
      placeType: form.placeType,
      municipality: form.municipality.trim(),
      region: form.region.trim(),
      country: form.country.trim(),
      visitCount: form.visitCount,
      visitKind: form.visitKind,
      period: form.period.trim() || "Datas não informadas",
      nights: form.visitKind === "day_trip" ? 0 : form.nights,
      wantsToReturn: form.wantsToReturn,
      note: form.note.trim(),
      tripId: null,
    });

    closeModal();
  }

  return (
    <div className="modal-backdrop" onMouseDown={closeModal}>
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="visit-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="visit-modal__header">
          <div>
            <span className="card-eyebrow">Registro rápido</span>
            <h2 id={titleId}>Adicionar um lugar que você já visitou</h2>
            <p>Esse registro entra no seu histórico sem criar viagem ou roteiro.</p>
          </div>
          <button aria-label="Fechar" className="modal-close" onClick={closeModal} type="button">
            <X size={19} />
          </button>
        </header>

        <div className="independent-record-note">
          <Route size={20} />
          <div>
            <strong>Registro avulso</strong>
            <span>A contagem do lugar será atualizada, mas o total de viagens continuará igual.</span>
          </div>
          <span className="independent-record-note__status"><Check size={13} /> Sem viagem</span>
        </div>

        <form className="visit-form" onSubmit={submitVisit}>
          <div className="form-grid">
            <label className="form-field form-field--wide">
              <span>Nome do lugar *</span>
              <div className="input-with-icon">
                <MapPin size={17} />
                <input
                  autoFocus
                  onChange={(event) => updateField("place", event.target.value)}
                  placeholder="Ex.: Taíba"
                  required
                  value={form.place}
                />
              </div>
            </label>

            <label className="form-field">
              <span>Tipo de lugar</span>
              <select
                onChange={(event) => updateField("placeType", event.target.value as FormState["placeType"])}
                value={form.placeType}
              >
                <option>Cidade</option>
                <option>Praia/localidade</option>
                <option>Distrito/vila</option>
                <option>Outro</option>
              </select>
            </label>

            <label className="form-field">
              <span>Cidade ou município de referência *</span>
              <input
                onChange={(event) => updateField("municipality", event.target.value)}
                placeholder="Ex.: São Gonçalo do Amarante"
                required
                value={form.municipality}
              />
              <small>Evita misturar lugares com nomes iguais e organiza o panorama regional.</small>
            </label>

            <label className="form-field">
              <span>Estado ou região *</span>
              <input
                onChange={(event) => updateField("region", event.target.value)}
                placeholder="Ex.: Ceará"
                required
                value={form.region}
              />
            </label>

            <label className="form-field">
              <span>País *</span>
              <input
                onChange={(event) => updateField("country", event.target.value)}
                required
                value={form.country}
              />
            </label>

            <div className="form-field">
              <span>Quantas vezes você foi? *</span>
              <div className="visit-counter">
                <button
                  aria-label="Diminuir quantidade"
                  disabled={form.visitCount === 1}
                  onClick={() => updateField("visitCount", Math.max(1, form.visitCount - 1))}
                  type="button"
                >
                  <Minus size={16} />
                </button>
                <strong>{form.visitCount}</strong>
                <button
                  aria-label="Aumentar quantidade"
                  onClick={() => updateField("visitCount", Math.min(99, form.visitCount + 1))}
                  type="button"
                >
                  <Plus size={16} />
                </button>
                <span>{form.visitCount === 1 ? "visita" : "visitas"}</span>
              </div>
            </div>

            <label className="form-field">
              <span>Quando aconteceu? <i>opcional</i></span>
              <div className="input-with-icon">
                <CalendarDays size={17} />
                <input
                  onChange={(event) => updateField("period", event.target.value)}
                  placeholder="Ex.: 2024 e 2025"
                  value={form.period}
                />
              </div>
              <small>Se não lembrar, deixe em branco.</small>
            </label>
          </div>

          <fieldset className="visit-kind-fieldset">
            <legend>Como foram essas visitas?</legend>
            <div className="visit-kind-options">
              {visitKinds.map(({ id, label, detail, icon: Icon }) => (
                <button
                  className={form.visitKind === id ? "visit-kind-option is-selected" : "visit-kind-option"}
                  key={id}
                  onClick={() => changeVisitKind(id)}
                  type="button"
                >
                  <Icon size={19} />
                  <span><strong>{label}</strong><small>{detail}</small></span>
                  <i>{form.visitKind === id && <Check size={13} />}</i>
                </button>
              ))}
            </div>
          </fieldset>

          {form.visitKind !== "day_trip" && (
            <label className="form-field form-field--nights">
              <span>Total de noites nesse lugar</span>
              <input
                min="1"
                onChange={(event) => updateField("nights", Math.max(1, Number(event.target.value)))}
                type="number"
                value={form.nights}
              />
              <small>Informe o total aproximado considerando todas as visitas.</small>
            </label>
          )}

          <label className="form-field form-field--wide">
            <span>Observação <i>opcional</i></span>
            <textarea
              onChange={(event) => updateField("note", event.target.value)}
              placeholder="Ex.: fui duas vezes apenas para passar o dia"
              rows={3}
              value={form.note}
            />
          </label>

          <label className="return-checkbox">
            <input
              checked={form.wantsToReturn}
              onChange={(event) => updateField("wantsToReturn", event.target.checked)}
              type="checkbox"
            />
            <span><strong>Quero voltar</strong><small>O lugar continuará como visitado e também ganhará esse marcador.</small></span>
          </label>

          <footer className="visit-modal__actions">
            <button className="filter-button" onClick={closeModal} type="button">Cancelar</button>
            <button className="primary-button" type="submit"><Plus size={16} /> Salvar sem criar viagem</button>
          </footer>
        </form>
      </section>
    </div>
  );
}
