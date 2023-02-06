---
grand_parent: Notes
parent: Components
title: AdSlot
---

# AdSlot

This component expects a Googletag in the component's head that is manually
added in the Storybook stories.

These stories are used alongside Storyshots to run visual regression tests
on the library components. Since the Google Ad Manager loads different ads
when a page is rendered depending on targeting and the available configured
ad units, a dummy ad was created specifically for testing purposes
to ensure consistency when testing.

It is important that the asynchronous nature of this component is also kept in
mind when making changes either to the component itself or the documentation. A
timer is used to give the component time to render before running visual tests
on it, for instance.
