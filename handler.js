(async () => {
    const { req, res } = api;
    if (req.method == "POST") {
        // Try to create under a note with label - messageInbox
        let messageInbox = api.getNoteWithLabel("messageInbox");
        if (!messageInbox) {
            // Fallback to day note
            messageInbox = api.getDayNote(api.dayjs().format("YYYY-MM-DD"));
        }

        // Text note handling
        let { content } = req.body;
        if (content !== undefined) {
            let { title, labelString = "" } = req.body;

            if (!content) {
                content = "";

                if (!title) {
                    title = "from ios shortcut";
                }
            } else {
                if (!title) {
                    title = content.slice(0, 20).replace("\n", " ");
                }

                // Normalize newlines from message
                content = content
                    .split("\n")
                    .reduce((final, block) => {
                        return (final += `<p>${block}</p>`);
                    }, "");
            }
            let note;

            const exist = api.searchForNote(`note.title = '${title}'`);
            if (exist) {
                note = exist;
                note.setContent(`${note.getContent()}${content}`);
            } else {
                note = api.createNewNote({
                    parentNoteId: messageInbox.noteId,
                    title,
                    content,
                    type: "text",
                }).note;

                const labels = labelString.replace(/\n/g, "").split("#");
                const trimmedLabels = labels
                    .map((label) => label.trim())
                    .filter((label) => label);

                if (trimmedLabels.length) {
                    trimmedLabels.forEach((label) => {
                        const [name, value] = label.split(" ");

                        if (value) {
                            note.setLabel(name, value);
                        } else {
                            note.setLabel(name);
                        }
                    });
                } else {
                    note.setLabel("from ios shortcut");
                }
            }

            res.status(200).json({
                code: 200,
                msg: "success",
                params: req.body,
                result: note.getPojo(),
            });
        } else {
            // Import modules using 'await import()'
            const multerModule = await import("multer");
            const importRoute = await import("../routes/api/import.js");

            const multerOptions = {
                fileFilter: (req, file, cb) => {
                    // Handle UTF-8 file names
                    file.originalname = Buffer.from(
                        file.originalname,
                        "latin1"
                    ).toString("utf-8");
                    cb(null, true);
                },
            };
            const uploadMiddleware = multerModule.default(
                multerOptions
            ).single("upload");

            uploadMiddleware(req, res, async () => {
                req.body.taskId = api.randomString(10);
                req.body.last = "true";
                req.params.parentNoteId = messageInbox.noteId;

                const options = {
                    safeImport: "true",
                    shrinkImages: "true",
                    textImportedAsText: "true",
                    codeImportedAsCode: "true",
                    explodeArchives: "true",
                    replaceUnderscoresWithSpaces: "true",
                };

                req.body = { ...req.body, ...options };

                try {
                    const result = await importRoute.default.importNotesToBranch(req);
                    res.status(200).json({
                        code: 200,
                        msg: "success",
                        params: req.body,
                        result: result,
                    });
                } catch (err) {
                    console.error(err);
                    res.status(500).json({
                        code: 500,
                        msg: "fail",
                        params: req.body,
                        error: err.message || err.toString(), // Include error message
                    });
                }
            });
        }
    }
})();