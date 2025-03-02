using System;
using System.Globalization;

namespace PublicLibrary
{
    public class TimeFormatter
    {
        public static string GetRelativeTime(DateTime dateTime)
        {
            var now = DateTime.Now;
            var timeDifference = now - dateTime;

            if (timeDifference.TotalSeconds < 60)
            {
                return "همین الان";
            }
            else if (timeDifference.TotalMinutes < 60)
            {
                int minutes = (int)timeDifference.TotalMinutes;
                return $"{minutes} دقیقه پیش";
            }
            else if (timeDifference.TotalHours < 24)
            {
                int hours = (int)timeDifference.TotalHours;
                return $"{hours} ساعت پیش";
            }
            else if (timeDifference.TotalDays < 7)
            {
                int days = (int)timeDifference.TotalDays;
                return $"{days} روز پیش";
            }
            else if (timeDifference.TotalDays < 30)
            {
                int weeks = (int)(timeDifference.TotalDays / 7);
                return $"{weeks} هفته پیش";
            }
            else if (timeDifference.TotalDays < 365)
            {
                int months = (int)(timeDifference.TotalDays / 30);
                return $"{months} ماه پیش";
            }
            else
            {
                // نمایش تاریخ شمسی برای بیش از یک سال
                PersianCalendar pc = new PersianCalendar();
                int year = pc.GetYear(dateTime);
                int month = pc.GetMonth(dateTime);
                int day = pc.GetDayOfMonth(dateTime);

                string[] monthsName = { "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند" };
                string monthName = monthsName[month - 1];

                return $"{day} {monthName} {year}";
            }
        }
    }
}
