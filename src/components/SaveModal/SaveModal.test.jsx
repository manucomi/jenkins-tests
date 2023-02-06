import '@testing-library/jest-dom/extend-expect';

import { screen, waitFor } from '@testing-library/react';

import ContentListService from 'Services/ContentListService/ContentListService';
import InteractionService from 'Services/InteractionService/InteractionService';
import React from 'react';
import userEvent from '@testing-library/user-event';
import noop from 'Helpers/noop/noop';
import SaveModal from './SaveModal';
import renderForSWR from '../../test-helpers/renderForSWR/renderForSWR';

jest.mock('Services/ContentListService/ContentListService');
jest.mock('Services/InteractionService/InteractionService');

const userEmailAddress = 'email@test.com';

afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
});

const mockListItems = [
    { id: '123', readOnly: false, name: 'Read Soon' },
    { id: '124', readOnly: false, name: 'Save For Later' },
    { id: '456', readOnly: true, name: 'hide me' },
];

beforeEach(() => {
    ContentListService.getContentLists.mockResolvedValue(mockListItems);
    InteractionService.save.mockResolvedValue({ savedActivityId: '123' });
});

function setupRender(component) {
    return {
        user: userEvent.setup({ delay: null }),
        ...renderForSWR(component),
    };
}

describe('<SaveModal /> component', () => {
    it('should successfully create a list and add to it', async () => {
        jest.useFakeTimers();
        const closeHandler = jest.fn();

        const { user } = setupRender(
            <SaveModal
                onClose={closeHandler}
                dataPoints={{}}
                userEmailAddress={userEmailAddress}
            />
        );
        await waitFor(() => {
            expect(screen.getByRole('form')).toBeInTheDocument();
        });

        await user.click(
            screen.getByRole('checkbox', {
                name: new RegExp(mockListItems[0].name, 'i'),
            })
        );
        await user.click(
            screen.getByRole('button', { name: /create new folder/i })
        );

        const saveBtn = screen.getByRole('button', { name: /^save/i });
        expect(saveBtn).toBeDisabled();

        await user.type(
            screen.getByRole('textbox', { name: /folder title/i }),
            'title'
        );
        await user.type(
            screen.getByRole('textbox', { name: /folder description/i }),
            'description'
        );

        ContentListService.createContentList.mockResolvedValueOnce({
            id: '34',
        });
        ContentListService.removeItemFromLists.mockResolvedValueOnce();
        ContentListService.addItemToLists.mockResolvedValueOnce();

        expect(saveBtn).not.toBeDisabled();
        await user.click(saveBtn);

        await waitFor(() => {
            expect(screen.queryByText(/saved/i)).toBeInTheDocument();
        });

        jest.runAllTimers();
        expect(closeHandler).toHaveBeenCalledTimes(1);
    });

    it('should remove the fields for creating a new list', async () => {
        const { user } = setupRender(
            <SaveModal
                onClose={noop}
                dataPoints={{}}
                userEmailAddress={userEmailAddress}
            />
        );
        await waitFor(() => {
            expect(screen.getByRole('form')).toBeInTheDocument();
        });

        await user.click(
            screen.getByRole('button', { name: /create new folder/i })
        );

        expect(
            screen.queryByRole('textbox', { name: /folder title/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('textbox', { name: /folder description/i })
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole('checkbox', { name: /create new folder/i })
        );

        expect(
            screen.queryByRole('textbox', { name: /folder title/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('textbox', { name: /folder description/i })
        ).not.toBeInTheDocument();
    });

    it('should display an error message when creating a list fails', async () => {
        jest.useFakeTimers();

        const closeHandler = jest.fn();
        const { user } = setupRender(
            <SaveModal
                onClose={closeHandler}
                dataPoints={{}}
                userEmailAddress={userEmailAddress}
            />
        );
        await waitFor(() => {
            expect(screen.getByRole('form')).toBeInTheDocument();
        });

        await user.click(
            screen.getByRole('button', { name: /create new folder/i })
        );

        const saveBtn = screen.getByRole('button', { name: /^save/i });
        expect(saveBtn).toBeDisabled();

        await user.type(
            screen.getByRole('textbox', { name: /folder title/i }),
            'title'
        );
        await user.type(
            screen.getByRole('textbox', { name: /folder description/i }),
            'description'
        );

        ContentListService.createContentList.mockRejectedValueOnce();

        expect(saveBtn).not.toBeDisabled();
        await user.click(saveBtn);

        expect(InteractionService.save).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(ContentListService.addItemToLists).not.toHaveBeenCalled();
            expect(screen.queryByText(/failed/i)).toBeInTheDocument();
        });

        jest.runAllTimers();
        expect(closeHandler).toHaveBeenCalledTimes(1);
    });

    it('should display an error message when creating a save item fails', async () => {
        renderForSWR(
            <SaveModal
                onClose={noop}
                dataPoints={{}}
                userEmailAddress={userEmailAddress}
            />
        );
        await waitFor(() => {
            expect(screen.getByRole('form')).toBeInTheDocument();
        });

        InteractionService.save.mockRejectedValueOnce();

        await userEvent.click(screen.getByRole('button', { name: /^save/i }));
        expect(InteractionService.save).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(
                ContentListService.removeItemFromLists
            ).not.toHaveBeenCalled();
            expect(screen.queryByText(/failed/i)).toBeInTheDocument();
        });
    });

    it('should display an error message when removing from a list fails', async () => {
        renderForSWR(
            <SaveModal
                onClose={noop}
                dataPoints={{}}
                userEmailAddress={userEmailAddress}
            />
        );
        await waitFor(() => {
            expect(screen.getByRole('form')).toBeInTheDocument();
        });

        ContentListService.removeItemFromLists.mockRejectedValueOnce();

        await userEvent.click(screen.getByRole('button', { name: /^save/i }));
        await waitFor(() => {
            expect(
                ContentListService.removeItemFromLists
            ).toHaveBeenCalledTimes(1);
            expect(screen.queryByText(/failed/i)).toBeInTheDocument();
        });
    });

    it('should not remove from any lists', async () => {
        renderForSWR(
            <SaveModal
                onClose={noop}
                dataPoints={{}}
                userEmailAddress={userEmailAddress}
            />
        );
        await waitFor(() => {
            expect(screen.getByRole('form')).toBeInTheDocument();
        });

        mockListItems.forEach(({ readOnly, name }) => {
            if (!readOnly) {
                userEvent.click(
                    screen.getByRole('checkbox', {
                        name: new RegExp(name, 'i'),
                    })
                );
            }
        });

        await userEvent.click(screen.getByRole('button', { name: /^save/i }));
        await waitFor(() => {
            expect(
                ContentListService.removeItemFromLists
            ).not.toHaveBeenCalled();
        });
    });
});
