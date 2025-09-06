const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     StudyGuide:
 *       type: object
 *       required:
 *         - title
 *         - week
 *         - day
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the study guide.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         title:
 *           type: string
 *           description: The title of the study guide.
 *           example: "Introduction to Derivatives"
 *         description:
 *           type: string
 *           description: The description of the study guide.
 *           example: "This section covers the basics of derivatives."
 *         week:
 *           type: integer
 *           description: The week number of the guide.
 *           example: 1
 *         day:
 *           type: integer
 *           description: The day number within the week.
 *           example: 2
 *         resources:
 *           type: array
 *           description: List of resources for the study guide.
 *           items:
 *             type: object
 *           example: [{ "type": "video", "url": "https://example.com/video" }]
 */

const params = z.object({
  id: z.string().uuid({ message: 'The ID must be a valid UUID' }),
});

const studyGuideSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string({ required_error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must not exceed 255 characters'),
  description: z.string().max(1000, 'Description too long').nullable().optional(),
  week: z.number({ required_error: 'Week is required' }).int().min(1),
  day: z.number({ required_error: 'Day is required' }).int().min(1),
  resources: z.array(z.record(z.any())).optional(),
});

const readStudyGuideRequestSchema = z.object({
  params,
});

const createStudyGuideRequestSchema = z.object({
  body: studyGuideSchema.omit({ id: true }),
});

const updateStudyGuideRequestSchema = z.object({
  params,
  body: studyGuideSchema.omit({ id: true }),
});

const deleteStudyGuideRequestSchema = z.object({
  params,
});

module.exports = {
  readStudyGuideRequestSchema,
  createStudyGuideRequestSchema,
  updateStudyGuideRequestSchema,
  deleteStudyGuideRequestSchema,
};
