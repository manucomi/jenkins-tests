/**
 * An API route to verify the health of the server.
 *
 * @param {object} req - The incoming request object.
 * @param {object} res - The outgoing response object.
 */
export default function handler(req, res) {
    res.status(200).json({
        status: 'OK',
        /**
         * __COMMIT_HASH__ will be replaced when building the docker image. Its value
         * comes from a `--build-arg` in the `docker build` command.
         */
        info: '__COMMIT_HASH__',
    });
}
