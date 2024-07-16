/*
  Warnings:

  - You are about to alter the column `timeSlot` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "timeSlot" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "patientId" TEXT NOT NULL,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("date", "id", "patientId", "status", "timeSlot") SELECT "date", "id", "patientId", "status", "timeSlot" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE UNIQUE INDEX "Appointment_date_timeSlot_patientId_key" ON "Appointment"("date", "timeSlot", "patientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
