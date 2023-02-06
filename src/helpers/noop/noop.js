/**
 * A helper to avoid defining noop functions repeatedly.
 *
 * @example
 * render(
 *     <Modal onClose={noop}>
 *         <p>I am a modal</p>
 *     </Modal>
 * );
 */
const noop = () => {};

export default noop;
