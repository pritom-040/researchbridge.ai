import { prisma } from '@repo/database';
import { sendEmail } from '../services/emailService';

export const checkUpcomingDeadlines = async () => {
  try {
    // 1. Find scholarships with a deadline in the next 3 days
    const upcomingDeadline = new Date();
    upcomingDeadline.setDate(upcomingDeadline.getDate() + 3);

    const applications = await prisma.application.findMany({
      where: {
        status: 'DRAFT',
        scholarship: {
          deadline: {
            lte: upcomingDeadline,
            gte: new Date(),
          },
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        scholarship: true,
      },
    });

    // 2. Notify students
    for (const app of applications) {
      const email = app.student.user.email;
      const scholarshipName = app.scholarship.name;
      const deadline = app.scholarship.deadline?.toDateString();

      await sendEmail(
        email,
        `Action Required: ${scholarshipName} deadline is approaching!`,
        `Hi, your drafted application for ${scholarshipName} is due on ${deadline}. Please complete it soon!`
      );
    }
    
    console.log(`Checked deadlines and notified ${applications.length} students.`);
  } catch (error) {
    console.error("Failed to check upcoming deadlines:", error);
  }
};
