import React from 'react';
import {
  BuildingIcon,
  LocationPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  BankNoteIcon,
} from './Icons';
import { formatDatePosted, formatEmploymentType, formatSalary } from '../utils/formatters';

export const JobCard = ({ data }) => {
  if (!data) return null;

  const displayType = formatEmploymentType(data.type);
  const displayDate = formatDatePosted(data.datePosted);
  const displaySalary = formatSalary(data.salary);

  return (
    <div className="apple-card">
      <h2 className="job-title">{data.title || 'Untitled Role'}</h2>

      {data.company && (
        <div className="company-row">
          <BuildingIcon size={13} color="var(--apple-blue)" />
          <span className="company-name">{data.company}</span>
        </div>
      )}

      {(data.location || displayType || displayDate || displaySalary) && (
        <div className="badge-row">
          {data.location && (
            <span className="apple-badge">
              <LocationPinIcon size={11} color="currentColor" />
              <span>{data.location}</span>
            </span>
          )}

          {displayType && (
            <span className="apple-badge badge-neutral">
              <BriefcaseIcon size={11} color="currentColor" />
              <span>{displayType}</span>
            </span>
          )}

          {displayDate && (
            <span className="apple-badge badge-neutral">
              <CalendarIcon size={11} color="currentColor" />
              <span>{displayDate}</span>
            </span>
          )}

          {displaySalary && (
            <span className="apple-badge badge-accent">
              <BankNoteIcon size={11} color="currentColor" />
              <span>{displaySalary}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
