import { render, screen } from '@testing-library/react';
import { MockArticle } from 'mfe-articles-shared';
import useArticleStore from 'stores/article/article.store';
import LayoutResolver from './LayoutResolver';

jest.mock('layouts/BigIdea/BigIdea', () => {
    const mockLayout = () => <div data-testid="big-idea" />;
    return mockLayout;
});
jest.mock('layouts/Spotlight/Spotlight', () => {
    const mockLayout = () => <div data-testid="spotlight" />;
    return mockLayout;
});
jest.mock('layouts/Standard/Standard', () => {
    const mockLayout = () => <div data-testid="standard" />;
    return mockLayout;
});
jest.mock('layouts/Premium/Premium', () => {
    const mockLayout = () => <div data-testid="premium" />;
    return mockLayout;
});

describe('LayoutResolver', () => {
    it('renders BigIdea component for big idea type', () => {
        const mockBigIdea = { ...MockArticle[0] };
        useArticleStore.getState().setArticle(mockBigIdea);

        render(<LayoutResolver />);
        const layoutMock = screen.getByTestId('big-idea');
        expect(layoutMock).toBeInTheDocument();
    });

    it('renders Spotlight component for spotlight type', () => {
        const mockSpotlight = { ...MockArticle[1] };
        useArticleStore.getState().setArticle(mockSpotlight);
        render(<LayoutResolver />);
        const layoutMock = screen.getByTestId('spotlight');

        expect(layoutMock).toBeInTheDocument();
    });

    it('renders Premium component for premium type', () => {
        const mockPremium = { ...MockArticle[3] };
        useArticleStore.getState().setArticle(mockPremium);
        render(<LayoutResolver />);
        const layoutMock = screen.getByTestId('premium');

        expect(layoutMock).toBeInTheDocument();
    });

    it('renders Standard component for unknown type', () => {
        const mockUnknown = { ...MockArticle[2], type: undefined };
        useArticleStore.getState().setArticle(mockUnknown);

        render(<LayoutResolver />);
        const layoutMock = screen.getByTestId('standard');

        expect(layoutMock).toBeInTheDocument();
    });
});
