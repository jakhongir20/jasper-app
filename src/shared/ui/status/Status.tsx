import { FC } from "react";
import { cn } from "@/shared/helpers";
import { getStatusLabel } from "@/shared/constants/getStatusLabel";

export enum STATUS {
  Draft = 1, // Черновик
  Open = 2, // Открыто
  Pending = 3, // В ожидании
  InProgress = 4, // В процессе
  Mixed = 5, // Смешанный
  Received = 6, // Получено
  Confirming = 7, // Подтверждать
  Closed = 8, // Закрыто
  Canceled = 9, // Отменено
  Deleted = 10, // Удалено
  Paid = 11, // Оплачено
  Archived = 12, // Архив
  Incoming = 13, // Вход
  Qualification = 14, // Квалификация
  Moved = 15, // Перемещен
  Active = 16, // Активен
  InActive = 17, //
  GreenActive = 20, //
  GreenConfirmed = 30, //
}

export type StatusType = keyof typeof STATUS;

interface Props {
  className?: string;
  value: number;
}

const generateStatus = (status: number) => {
  switch (status) {
    case 1:
    case 17:
    case 12:
    case 13:
    case 14:
      return "text-black-100 bg-gray-700 border border-white/[20%]";
    //   GREEN
    case 2:
    case 11:
    case 30: // GREEN Подтверждать
    case 20: // GREEN AVTIVE
      return "text-white bg-green border border-white/[20%]";
    // ORANGE
    case 3:
    case 4:
    case 5:
    case 15:
      return "text-white bg-orange border border-white/[20%]";
    // RED
    case 8:
    case 9:
    case 10:
      return "text-white bg-red border-white/[20%]";
    // BLUE
    case 6:
    case 7:
    case 16:
      return "text-white bg-blue border border-white/[20%]";
  }
};

export const Status: FC<Props> = ({ className, value }) => {
  const status = generateStatus(+value);

  return (
    <div
      className={cn(
        className,
        status,
        "max-w-max rounded border border-white-20 px-6px py-2px text-center text-xs font-semibold uppercase",
      )}
    >
      {getStatusLabel(+value)}
    </div>
  );
};
