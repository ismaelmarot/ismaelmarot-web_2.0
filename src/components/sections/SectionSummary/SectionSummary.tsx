import { Link } from 'react-router-dom';
import {
  StyledSectionSummary,
  StyledSectionSummaryContent,
  StyledSectionSummaryTitle,
  StyledSectionSummaryDescription,
  StyledSectionSummaryCta,
  StyledSectionSummaryFeatured,
} from './SectionSummary.styles';

export interface SectionSummaryProps {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  featuredItems?: React.ReactNode;
  background?: 'default' | 'muted';
}

export const SectionSummary = ({
  id,
  title,
  description,
  ctaLabel,
  ctaHref,
  featuredItems,
  background = 'default',
}: SectionSummaryProps) => {
  return (
    <StyledSectionSummary
      id={id}
      $background={background}
      aria-label={title}
    >
      <StyledSectionSummaryContent>
        <StyledSectionSummaryTitle as="h2">{title}</StyledSectionSummaryTitle>
        <StyledSectionSummaryDescription as="p">{description}</StyledSectionSummaryDescription>
        <StyledSectionSummaryCta as={Link} to={ctaHref}>
          {ctaLabel}
        </StyledSectionSummaryCta>
        {featuredItems && (
          <StyledSectionSummaryFeatured>
            {featuredItems}
          </StyledSectionSummaryFeatured>
        )}
      </StyledSectionSummaryContent>
    </StyledSectionSummary>
  );
};
