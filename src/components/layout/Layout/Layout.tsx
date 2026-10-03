import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { siteConfig } from '@/data/site-config';
import { StyledLayout, StyledMain } from './Layout.styles';
import { useLayout } from './useLayout';

export const Layout = () => {
  const { navigation, cta } = useLayout();

  return (
    <StyledLayout>
      <ScrollToTop />
      <SkipLink targets={['main-content']} />
      <Header navigation={navigation} cta={cta} />
      <StyledMain id="main-content">
        <Outlet />
      </StyledMain>
      <Footer
        copyright={siteConfig.name}
        socialLinks={siteConfig.socialLinks}
        navigation={navigation}
      />
    </StyledLayout>
  );
};
