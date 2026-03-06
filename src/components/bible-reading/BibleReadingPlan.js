import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import churchLogo from '../../assets/cag-logo.png';
import './BibleReadingPlan.css';

const BibleReadingPlan = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Load completed days from localStorage
    const saved = localStorage.getItem('bibleReadingProgress');
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }

    // Calculate current day of year
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    setCurrentDay(dayOfYear);

    // Scroll to top button visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDayCompletion = (day) => {
    const updated = completedDays.includes(day)
      ? completedDays.filter(d => d !== day)
      : [...completedDays, day];
    
    setCompletedDays(updated);
    localStorage.setItem('bibleReadingProgress', JSON.stringify(updated));
  };

  const handleShare = async () => {
    const shareData = {
      title: 'One Year Bible Reading Plan - Christ AG Church | ഒരു വർഷം ബൈബിൾ വായനാ പദ്ധതി',
      text: `📖 One Year Bible Reading Plan | ഒരു വർഷം ബൈബിൾ വായനാ പദ്ധതി\n\nJoin me in reading through the entire Bible in one year!\nഒരു വർഷം കൊണ്ട് മുഴുവൻ ബൈബിളും വായിക്കാൻ എന്നോടൊപ്പം ചേരൂ!\n\nRead through the Old Testament, New Testament, Psalms, and Proverbs systematically.\nപഴയനിയമം, പുതിയനിയമം, സങ്കീർത്തനങ്ങൾ, സദൃശ്യവാക്യങ്ങൾ എന്നിവ ക്രമാനുസൃതമായി വായിക്കൂ.\n\nഈ വായനാ പദ്ധതി നിങ്ങളെ ഒരു വർഷത്തിനുള്ളിൽ മുഴുവൻ ബൈബിളിലൂടെയും കൊണ്ടുപോകും. ഓരോ ദിവസവും പഴയനിയമം, പുതിയനിയമം, സങ്കീർത്തനങ്ങൾ, സദൃശ്യവാക്യങ്ങൾ എന്നിവയിൽ നിന്നുള്ള വായനകൾ ഉൾപ്പെടുന്നു. നിങ്ങളുടെ പുരോഗതി ട്രാക്ക് ചെയ്യാൻ ഓരോ ദിവസവും പൂർത്തിയാക്കുമ്പോൾ ചെക്ക് ചെയ്യുക.\n\n"Your word is a lamp for my feet, a light on my path." - Psalm 119:105\n"അങ്ങയുടെ വചനം എന്റെ കാലിന് ദീപവും എന്റെ പാതയ്ക്ക് പ്രകാശവുമാകുന്നു." - സങ്കീർത്തനം 119:105`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        alert('Content copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Bible reading plan data - One Year Bible Reading Plan
  const readingPlan = [
    // January (31 days)
    { day: 1, month: 'January', date: 'Jan 1', ot: 'Genesis 1-3', nt: 'Matthew 1', ps: 'Psalm 1', pr: 'Proverbs 1:1-6' },
    { day: 2, month: 'January', date: 'Jan 2', ot: 'Genesis 4-6', nt: 'Matthew 2', ps: 'Psalm 2', pr: 'Proverbs 1:7-9' },
    { day: 3, month: 'January', date: 'Jan 3', ot: 'Genesis 7-9', nt: 'Matthew 3', ps: 'Psalm 3', pr: 'Proverbs 1:10-19' },
    { day: 4, month: 'January', date: 'Jan 4', ot: 'Genesis 10-12', nt: 'Matthew 4', ps: 'Psalm 4', pr: 'Proverbs 1:20-23' },
    { day: 5, month: 'January', date: 'Jan 5', ot: 'Genesis 13-15', nt: 'Matthew 5:1-26', ps: 'Psalm 5', pr: 'Proverbs 1:24-28' },
    { day: 6, month: 'January', date: 'Jan 6', ot: 'Genesis 16-18', nt: 'Matthew 5:27-48', ps: 'Psalm 6', pr: 'Proverbs 1:29-33' },
    { day: 7, month: 'January', date: 'Jan 7', ot: 'Genesis 19-21', nt: 'Matthew 6:1-18', ps: 'Psalm 7', pr: 'Proverbs 2:1-5' },
    { day: 8, month: 'January', date: 'Jan 8', ot: 'Genesis 22-24', nt: 'Matthew 6:19-34', ps: 'Psalm 8', pr: 'Proverbs 2:6-15' },
    { day: 9, month: 'January', date: 'Jan 9', ot: 'Genesis 25-26', nt: 'Matthew 7', ps: 'Psalm 9:1-12', pr: 'Proverbs 2:16-22' },
    { day: 10, month: 'January', date: 'Jan 10', ot: 'Genesis 27-28', nt: 'Matthew 8:1-17', ps: 'Psalm 9:13-20', pr: 'Proverbs 3:1-6' },
    { day: 11, month: 'January', date: 'Jan 11', ot: 'Genesis 29-30', nt: 'Matthew 8:18-34', ps: 'Psalm 10:1-15', pr: 'Proverbs 3:7-8' },
    { day: 12, month: 'January', date: 'Jan 12', ot: 'Genesis 31-32', nt: 'Matthew 9:1-17', ps: 'Psalm 10:16-18', pr: 'Proverbs 3:9-10' },
    { day: 13, month: 'January', date: 'Jan 13', ot: 'Genesis 33-35', nt: 'Matthew 9:18-38', ps: 'Psalm 11', pr: 'Proverbs 3:11-12' },
    { day: 14, month: 'January', date: 'Jan 14', ot: 'Genesis 36-38', nt: 'Matthew 10:1-23', ps: 'Psalm 12', pr: 'Proverbs 3:13-15' },
    { day: 15, month: 'January', date: 'Jan 15', ot: 'Genesis 39-40', nt: 'Matthew 10:24-42', ps: 'Psalm 13', pr: 'Proverbs 3:16-18' },
    { day: 16, month: 'January', date: 'Jan 16', ot: 'Genesis 41-42', nt: 'Matthew 11', ps: 'Psalm 14', pr: 'Proverbs 3:19-20' },
    { day: 17, month: 'January', date: 'Jan 17', ot: 'Genesis 43-45', nt: 'Matthew 12:1-21', ps: 'Psalm 15', pr: 'Proverbs 3:21-26' },
    { day: 18, month: 'January', date: 'Jan 18', ot: 'Genesis 46-47', nt: 'Matthew 12:22-45', ps: 'Psalm 16', pr: 'Proverbs 3:27-32' },
    { day: 19, month: 'January', date: 'Jan 19', ot: 'Genesis 48-50', nt: 'Matthew 12:46-13:23', ps: 'Psalm 17', pr: 'Proverbs 3:33-35' },
    { day: 20, month: 'January', date: 'Jan 20', ot: 'Exodus 1-3', nt: 'Matthew 13:24-46', ps: 'Psalm 18:1-15', pr: 'Proverbs 4:1-6' },
    { day: 21, month: 'January', date: 'Jan 21', ot: 'Exodus 4-6', nt: 'Matthew 13:47-14:12', ps: 'Psalm 18:16-36', pr: 'Proverbs 4:7-10' },
    { day: 22, month: 'January', date: 'Jan 22', ot: 'Exodus 7-8', nt: 'Matthew 14:13-36', ps: 'Psalm 18:37-50', pr: 'Proverbs 4:11-13' },
    { day: 23, month: 'January', date: 'Jan 23', ot: 'Exodus 9-11', nt: 'Matthew 15:1-28', ps: 'Psalm 19', pr: 'Proverbs 4:14-19' },
    { day: 24, month: 'January', date: 'Jan 24', ot: 'Exodus 12-13', nt: 'Matthew 15:29-16:12', ps: 'Psalm 20', pr: 'Proverbs 4:20-27' },
    { day: 25, month: 'January', date: 'Jan 25', ot: 'Exodus 14-15', nt: 'Matthew 16:13-17:9', ps: 'Psalm 21', pr: 'Proverbs 5:1-6' },
    { day: 26, month: 'January', date: 'Jan 26', ot: 'Exodus 16-18', nt: 'Matthew 17:10-27', ps: 'Psalm 22:1-18', pr: 'Proverbs 5:7-14' },
    { day: 27, month: 'January', date: 'Jan 27', ot: 'Exodus 19-21', nt: 'Matthew 18:1-20', ps: 'Psalm 22:19-31', pr: 'Proverbs 5:15-21' },
    { day: 28, month: 'January', date: 'Jan 28', ot: 'Exodus 22-24', nt: 'Matthew 18:21-19:12', ps: 'Psalm 23', pr: 'Proverbs 5:22-23' },
    { day: 29, month: 'January', date: 'Jan 29', ot: 'Exodus 25-27', nt: 'Matthew 19:13-30', ps: 'Psalm 24', pr: 'Proverbs 6:1-5' },
    { day: 30, month: 'January', date: 'Jan 30', ot: 'Exodus 28-29', nt: 'Matthew 20:1-28', ps: 'Psalm 25:1-15', pr: 'Proverbs 6:6-11' },
    { day: 31, month: 'January', date: 'Jan 31', ot: 'Exodus 30-32', nt: 'Matthew 20:29-21:22', ps: 'Psalm 25:16-22', pr: 'Proverbs 6:12-15' },
    
    // February (28 days)
    { day: 32, month: 'February', date: 'Feb 1', ot: 'Exodus 33-35', nt: 'Matthew 21:23-46', ps: 'Psalm 26', pr: 'Proverbs 6:16-19' },
    { day: 33, month: 'February', date: 'Feb 2', ot: 'Exodus 36-38', nt: 'Matthew 22:1-33', ps: 'Psalm 27:1-6', pr: 'Proverbs 6:20-26' },
    { day: 34, month: 'February', date: 'Feb 3', ot: 'Exodus 39-40', nt: 'Matthew 22:34-23:12', ps: 'Psalm 27:7-14', pr: 'Proverbs 6:27-35' },
    { day: 35, month: 'February', date: 'Feb 4', ot: 'Leviticus 1-3', nt: 'Matthew 23:13-39', ps: 'Psalm 28', pr: 'Proverbs 7:1-5' },
    { day: 36, month: 'February', date: 'Feb 5', ot: 'Leviticus 4-5', nt: 'Matthew 24:1-28', ps: 'Psalm 29', pr: 'Proverbs 7:6-23' },
    { day: 37, month: 'February', date: 'Feb 6', ot: 'Leviticus 6-7', nt: 'Matthew 24:29-51', ps: 'Psalm 30', pr: 'Proverbs 7:24-27' },
    { day: 38, month: 'February', date: 'Feb 7', ot: 'Leviticus 8-10', nt: 'Matthew 25:1-30', ps: 'Psalm 31:1-8', pr: 'Proverbs 8:1-11' },
    { day: 39, month: 'February', date: 'Feb 8', ot: 'Leviticus 11-12', nt: 'Matthew 25:31-26:13', ps: 'Psalm 31:9-18', pr: 'Proverbs 8:12-13' },
    { day: 40, month: 'February', date: 'Feb 9', ot: 'Leviticus 13', nt: 'Matthew 26:14-46', ps: 'Psalm 31:19-24', pr: 'Proverbs 8:14-26' },
    { day: 41, month: 'February', date: 'Feb 10', ot: 'Leviticus 14', nt: 'Matthew 26:47-68', ps: 'Psalm 32', pr: 'Proverbs 8:27-32' },
    { day: 42, month: 'February', date: 'Feb 11', ot: 'Leviticus 15-16', nt: 'Matthew 26:69-27:14', ps: 'Psalm 33:1-11', pr: 'Proverbs 8:33-36' },
    { day: 43, month: 'February', date: 'Feb 12', ot: 'Leviticus 17-18', nt: 'Matthew 27:15-31', ps: 'Psalm 33:12-22', pr: 'Proverbs 9:1-6' },
    { day: 44, month: 'February', date: 'Feb 13', ot: 'Leviticus 19-20', nt: 'Matthew 27:32-66', ps: 'Psalm 34:1-10', pr: 'Proverbs 9:7-8' },
    { day: 45, month: 'February', date: 'Feb 14', ot: 'Leviticus 21-22', nt: 'Matthew 28', ps: 'Psalm 34:11-22', pr: 'Proverbs 9:9-10' },
    { day: 46, month: 'February', date: 'Feb 15', ot: 'Leviticus 23-24', nt: 'Mark 1:1-28', ps: 'Psalm 35:1-16', pr: 'Proverbs 9:11-12' },
    { day: 47, month: 'February', date: 'Feb 16', ot: 'Leviticus 25', nt: 'Mark 1:29-2:12', ps: 'Psalm 35:17-28', pr: 'Proverbs 9:13-18' },
    { day: 48, month: 'February', date: 'Feb 17', ot: 'Leviticus 26-27', nt: 'Mark 2:13-3:6', ps: 'Psalm 36', pr: 'Proverbs 10:1-2' },
    { day: 49, month: 'February', date: 'Feb 18', ot: 'Numbers 1-2', nt: 'Mark 3:7-30', ps: 'Psalm 37:1-11', pr: 'Proverbs 10:3-4' },
    { day: 50, month: 'February', date: 'Feb 19', ot: 'Numbers 3-4', nt: 'Mark 3:31-4:25', ps: 'Psalm 37:12-29', pr: 'Proverbs 10:5' },
    { day: 51, month: 'February', date: 'Feb 20', ot: 'Numbers 5-6', nt: 'Mark 4:26-5:20', ps: 'Psalm 37:30-40', pr: 'Proverbs 10:6-7' },
    { day: 52, month: 'February', date: 'Feb 21', ot: 'Numbers 7-8', nt: 'Mark 5:21-43', ps: 'Psalm 38', pr: 'Proverbs 10:8-9' },
    { day: 53, month: 'February', date: 'Feb 22', ot: 'Numbers 9-11', nt: 'Mark 6:1-29', ps: 'Psalm 39', pr: 'Proverbs 10:10' },
    { day: 54, month: 'February', date: 'Feb 23', ot: 'Numbers 12-14', nt: 'Mark 6:30-56', ps: 'Psalm 40:1-10', pr: 'Proverbs 10:11-12' },
    { day: 55, month: 'February', date: 'Feb 24', ot: 'Numbers 15-16', nt: 'Mark 7:1-23', ps: 'Psalm 40:11-17', pr: 'Proverbs 10:13-14' },
    { day: 56, month: 'February', date: 'Feb 25', ot: 'Numbers 17-19', nt: 'Mark 7:24-8:10', ps: 'Psalm 41', pr: 'Proverbs 10:15-16' },
    { day: 57, month: 'February', date: 'Feb 26', ot: 'Numbers 20-21', nt: 'Mark 8:11-38', ps: 'Psalm 42', pr: 'Proverbs 10:17' },
    { day: 58, month: 'February', date: 'Feb 27', ot: 'Numbers 22-24', nt: 'Mark 9:1-29', ps: 'Psalm 43', pr: 'Proverbs 10:18' },
    { day: 59, month: 'February', date: 'Feb 28', ot: 'Numbers 25-26', nt: 'Mark 9:30-10:12', ps: 'Psalm 44', pr: 'Proverbs 10:19' },
    
    // March (31 days)
    { day: 60, month: 'March', date: 'Mar 1', ot: 'Numbers 27-29', nt: 'Mark 10:13-31', ps: 'Psalm 45:1-5', pr: 'Proverbs 10:20-21' },
    { day: 61, month: 'March', date: 'Mar 2', ot: 'Numbers 30-31', nt: 'Mark 10:32-52', ps: 'Psalm 45:6-17', pr: 'Proverbs 10:22' },
    { day: 62, month: 'March', date: 'Mar 3', ot: 'Numbers 32-33', nt: 'Mark 11:1-26', ps: 'Psalm 46', pr: 'Proverbs 10:23' },
    { day: 63, month: 'March', date: 'Mar 4', ot: 'Numbers 34-36', nt: 'Mark 11:27-12:17', ps: 'Psalm 47', pr: 'Proverbs 10:24-25' },
    { day: 64, month: 'March', date: 'Mar 5', ot: 'Deuteronomy 1-2', nt: 'Mark 12:18-37', ps: 'Psalm 48', pr: 'Proverbs 10:26' },
    { day: 65, month: 'March', date: 'Mar 6', ot: 'Deuteronomy 3-4', nt: 'Mark 12:38-13:13', ps: 'Psalm 49:1-9', pr: 'Proverbs 10:27-28' },
    { day: 66, month: 'March', date: 'Mar 7', ot: 'Deuteronomy 5-7', nt: 'Mark 13:14-37', ps: 'Psalm 49:10-20', pr: 'Proverbs 10:29-30' },
    { day: 67, month: 'March', date: 'Mar 8', ot: 'Deuteronomy 8-10', nt: 'Mark 14:1-26', ps: 'Psalm 50:1-15', pr: 'Proverbs 10:31-32' },
    { day: 68, month: 'March', date: 'Mar 9', ot: 'Deuteronomy 11-13', nt: 'Mark 14:27-53', ps: 'Psalm 50:16-23', pr: 'Proverbs 11:1-3' },
    { day: 69, month: 'March', date: 'Mar 10', ot: 'Deuteronomy 14-16', nt: 'Mark 14:54-72', ps: 'Psalm 51', pr: 'Proverbs 11:4' },
    { day: 70, month: 'March', date: 'Mar 11', ot: 'Deuteronomy 17-19', nt: 'Mark 15:1-26', ps: 'Psalm 52', pr: 'Proverbs 11:5-6' },
    { day: 71, month: 'March', date: 'Mar 12', ot: 'Deuteronomy 20-22', nt: 'Mark 15:27-47', ps: 'Psalm 53', pr: 'Proverbs 11:7' },
    { day: 72, month: 'March', date: 'Mar 13', ot: 'Deuteronomy 23-25', nt: 'Mark 16', ps: 'Psalm 54', pr: 'Proverbs 11:8' },
    { day: 73, month: 'March', date: 'Mar 14', ot: 'Deuteronomy 26-27', nt: 'Luke 1:1-25', ps: 'Psalm 55', pr: 'Proverbs 11:9-11' },
    { day: 74, month: 'March', date: 'Mar 15', ot: 'Deuteronomy 28', nt: 'Luke 1:26-56', ps: 'Psalm 56', pr: 'Proverbs 11:12-13' },
    { day: 75, month: 'March', date: 'Mar 16', ot: 'Deuteronomy 29-30', nt: 'Luke 1:57-80', ps: 'Psalm 57', pr: 'Proverbs 11:14' },
    { day: 76, month: 'March', date: 'Mar 17', ot: 'Deuteronomy 31-32', nt: 'Luke 2:1-24', ps: 'Psalm 58', pr: 'Proverbs 11:15' },
    { day: 77, month: 'March', date: 'Mar 18', ot: 'Deuteronomy 33-34', nt: 'Luke 2:25-52', ps: 'Psalm 59:1-8', pr: 'Proverbs 11:16-17' },
    { day: 78, month: 'March', date: 'Mar 19', ot: 'Joshua 1-3', nt: 'Luke 3', ps: 'Psalm 59:9-17', pr: 'Proverbs 11:18-19' },
    { day: 79, month: 'March', date: 'Mar 20', ot: 'Joshua 4-6', nt: 'Luke 4:1-32', ps: 'Psalm 60', pr: 'Proverbs 11:20-21' },
    { day: 80, month: 'March', date: 'Mar 21', ot: 'Joshua 7-9', nt: 'Luke 4:33-5:11', ps: 'Psalm 61', pr: 'Proverbs 11:22' },
    { day: 81, month: 'March', date: 'Mar 22', ot: 'Joshua 10-12', nt: 'Luke 5:12-28', ps: 'Psalm 62', pr: 'Proverbs 11:23' },
    { day: 82, month: 'March', date: 'Mar 23', ot: 'Joshua 13-15', nt: 'Luke 5:29-6:11', ps: 'Psalm 63', pr: 'Proverbs 11:24-26' },
    { day: 83, month: 'March', date: 'Mar 24', ot: 'Joshua 16-18', nt: 'Luke 6:12-38', ps: 'Psalm 64', pr: 'Proverbs 11:27' },
    { day: 84, month: 'March', date: 'Mar 25', ot: 'Joshua 19-21', nt: 'Luke 6:39-7:10', ps: 'Psalm 65', pr: 'Proverbs 11:28' },
    { day: 85, month: 'March', date: 'Mar 26', ot: 'Joshua 22-24', nt: 'Luke 7:11-35', ps: 'Psalm 66:1-12', pr: 'Proverbs 11:29-31' },
    { day: 86, month: 'March', date: 'Mar 27', ot: 'Judges 1-2', nt: 'Luke 7:36-8:3', ps: 'Psalm 66:13-20', pr: 'Proverbs 12:1' },
    { day: 87, month: 'March', date: 'Mar 28', ot: 'Judges 3-5', nt: 'Luke 8:4-21', ps: 'Psalm 67', pr: 'Proverbs 12:2-3' },
    { day: 88, month: 'March', date: 'Mar 29', ot: 'Judges 6-7', nt: 'Luke 8:22-39', ps: 'Psalm 68:1-18', pr: 'Proverbs 12:4' },
    { day: 89, month: 'March', date: 'Mar 30', ot: 'Judges 8-9', nt: 'Luke 8:40-56', ps: 'Psalm 68:19-35', pr: 'Proverbs 12:5-7' },
    { day: 90, month: 'March', date: 'Mar 31', ot: 'Judges 10-11', nt: 'Luke 9:1-17', ps: 'Psalm 69:1-12', pr: 'Proverbs 12:8-9' },
    
    // April (30 days)
    { day: 91, month: 'April', date: 'Apr 1', ot: 'Judges 12-14', nt: 'Luke 9:18-36', ps: 'Psalm 69:13-28', pr: 'Proverbs 12:10' },
    { day: 92, month: 'April', date: 'Apr 2', ot: 'Judges 15-17', nt: 'Luke 9:37-62', ps: 'Psalm 69:29-36', pr: 'Proverbs 12:11' },
    { day: 93, month: 'April', date: 'Apr 3', ot: 'Judges 18-19', nt: 'Luke 10:1-24', ps: 'Psalm 70', pr: 'Proverbs 12:12-14' },
    { day: 94, month: 'April', date: 'Apr 4', ot: 'Judges 20-21', nt: 'Luke 10:25-42', ps: 'Psalm 71:1-16', pr: 'Proverbs 12:15-17' },
    { day: 95, month: 'April', date: 'Apr 5', ot: 'Ruth 1-4', nt: 'Luke 11:1-28', ps: 'Psalm 71:17-24', pr: 'Proverbs 12:18' },
    { day: 96, month: 'April', date: 'Apr 6', ot: '1 Samuel 1-3', nt: 'Luke 11:29-54', ps: 'Psalm 72', pr: 'Proverbs 12:19-20' },
    { day: 97, month: 'April', date: 'Apr 7', ot: '1 Samuel 4-6', nt: 'Luke 12:1-31', ps: 'Psalm 73:1-14', pr: 'Proverbs 12:21-23' },
    { day: 98, month: 'April', date: 'Apr 8', ot: '1 Samuel 7-9', nt: 'Luke 12:32-59', ps: 'Psalm 73:15-28', pr: 'Proverbs 12:24' },
    { day: 99, month: 'April', date: 'Apr 9', ot: '1 Samuel 10-12', nt: 'Luke 13:1-21', ps: 'Psalm 74', pr: 'Proverbs 12:25' },
    { day: 100, month: 'April', date: 'Apr 10', ot: '1 Samuel 13-14', nt: 'Luke 13:22-14:6', ps: 'Psalm 75', pr: 'Proverbs 12:26' },
    { day: 101, month: 'April', date: 'Apr 11', ot: '1 Samuel 15-16', nt: 'Luke 14:7-35', ps: 'Psalm 76', pr: 'Proverbs 12:27-28' },
    { day: 102, month: 'April', date: 'Apr 12', ot: '1 Samuel 17-18', nt: 'Luke 15:1-10', ps: 'Psalm 77', pr: 'Proverbs 13:1' },
    { day: 103, month: 'April', date: 'Apr 13', ot: '1 Samuel 19-21', nt: 'Luke 15:11-32', ps: 'Psalm 78:1-31', pr: 'Proverbs 13:2-3' },
    { day: 104, month: 'April', date: 'Apr 14', ot: '1 Samuel 22-24', nt: 'Luke 16', ps: 'Psalm 78:32-55', pr: 'Proverbs 13:4' },
    { day: 105, month: 'April', date: 'Apr 15', ot: '1 Samuel 25-26', nt: 'Luke 17:1-19', ps: 'Psalm 78:56-72', pr: 'Proverbs 13:5-6' },
    { day: 106, month: 'April', date: 'Apr 16', ot: '1 Samuel 27-29', nt: 'Luke 17:20-18:8', ps: 'Psalm 79', pr: 'Proverbs 13:7-8' },
    { day: 107, month: 'April', date: 'Apr 17', ot: '1 Samuel 30-31', nt: 'Luke 18:9-30', ps: 'Psalm 80', pr: 'Proverbs 13:9-10' },
    { day: 108, month: 'April', date: 'Apr 18', ot: '2 Samuel 1-2', nt: 'Luke 18:31-19:10', ps: 'Psalm 81', pr: 'Proverbs 13:11' },
    { day: 109, month: 'April', date: 'Apr 19', ot: '2 Samuel 3-5', nt: 'Luke 19:11-27', ps: 'Psalm 82', pr: 'Proverbs 13:12-14' },
    { day: 110, month: 'April', date: 'Apr 20', ot: '2 Samuel 6-8', nt: 'Luke 19:28-48', ps: 'Psalm 83', pr: 'Proverbs 13:15-16' },
    { day: 111, month: 'April', date: 'Apr 21', ot: '2 Samuel 9-11', nt: 'Luke 20:1-26', ps: 'Psalm 84', pr: 'Proverbs 13:17-19' },
    { day: 112, month: 'April', date: 'Apr 22', ot: '2 Samuel 12-13', nt: 'Luke 20:27-47', ps: 'Psalm 85', pr: 'Proverbs 13:20-23' },
    { day: 113, month: 'April', date: 'Apr 23', ot: '2 Samuel 14-15', nt: 'Luke 21:1-19', ps: 'Psalm 86', pr: 'Proverbs 13:24-25' },
    { day: 114, month: 'April', date: 'Apr 24', ot: '2 Samuel 16-18', nt: 'Luke 21:20-22:6', ps: 'Psalm 87', pr: 'Proverbs 14:1-2' },
    { day: 115, month: 'April', date: 'Apr 25', ot: '2 Samuel 19-20', nt: 'Luke 22:7-30', ps: 'Psalm 88', pr: 'Proverbs 14:3-4' },
    { day: 116, month: 'April', date: 'Apr 26', ot: '2 Samuel 21-22', nt: 'Luke 22:31-54', ps: 'Psalm 89:1-18', pr: 'Proverbs 14:5-6' },
    { day: 117, month: 'April', date: 'Apr 27', ot: '2 Samuel 23-24', nt: 'Luke 22:55-23:12', ps: 'Psalm 89:19-37', pr: 'Proverbs 14:7-8' },
    { day: 118, month: 'April', date: 'Apr 28', ot: '1 Kings 1-2', nt: 'Luke 23:13-43', ps: 'Psalm 89:38-52', pr: 'Proverbs 14:9-10' },
    { day: 119, month: 'April', date: 'Apr 29', ot: '1 Kings 3-5', nt: 'Luke 23:44-24:12', ps: 'Psalm 90', pr: 'Proverbs 14:11-12' },
    { day: 120, month: 'April', date: 'Apr 30', ot: '1 Kings 6-7', nt: 'Luke 24:13-53', ps: 'Psalm 91', pr: 'Proverbs 14:13-14' },
    
    // May (31 days)
    { day: 121, month: 'May', date: 'May 1', ot: '1 Kings 8-9', nt: 'John 1:1-28', ps: 'Psalm 92', pr: 'Proverbs 14:15-16' },
    { day: 122, month: 'May', date: 'May 2', ot: '1 Kings 10-11', nt: 'John 1:29-51', ps: 'Psalm 93', pr: 'Proverbs 14:17-19' },
    { day: 123, month: 'May', date: 'May 3', ot: '1 Kings 12-13', nt: 'John 2', ps: 'Psalm 94:1-11', pr: 'Proverbs 14:20-21' },
    { day: 124, month: 'May', date: 'May 4', ot: '1 Kings 14-15', nt: 'John 3:1-21', ps: 'Psalm 94:12-23', pr: 'Proverbs 14:22-24' },
    { day: 125, month: 'May', date: 'May 5', ot: '1 Kings 16-18', nt: 'John 3:22-4:6', ps: 'Psalm 95', pr: 'Proverbs 14:25' },
    { day: 126, month: 'May', date: 'May 6', ot: '1 Kings 19-20', nt: 'John 4:7-42', ps: 'Psalm 96', pr: 'Proverbs 14:26-27' },
    { day: 127, month: 'May', date: 'May 7', ot: '1 Kings 21-22', nt: 'John 4:43-54', ps: 'Psalm 97', pr: 'Proverbs 14:28-29' },
    { day: 128, month: 'May', date: 'May 8', ot: '2 Kings 1-3', nt: 'John 5:1-23', ps: 'Psalm 98', pr: 'Proverbs 14:30-31' },
    { day: 129, month: 'May', date: 'May 9', ot: '2 Kings 4-6', nt: 'John 5:24-47', ps: 'Psalm 99', pr: 'Proverbs 14:32-33' },
    { day: 130, month: 'May', date: 'May 10', ot: '2 Kings 7-9', nt: 'John 6:1-21', ps: 'Psalm 100', pr: 'Proverbs 14:34-35' },
    { day: 131, month: 'May', date: 'May 11', ot: '2 Kings 10-12', nt: 'John 6:22-42', ps: 'Psalm 101', pr: 'Proverbs 15:1-3' },
    { day: 132, month: 'May', date: 'May 12', ot: '2 Kings 13-14', nt: 'John 6:43-71', ps: 'Psalm 102:1-17', pr: 'Proverbs 15:4' },
    { day: 133, month: 'May', date: 'May 13', ot: '2 Kings 15-16', nt: 'John 7:1-27', ps: 'Psalm 102:18-28', pr: 'Proverbs 15:5-7' },
    { day: 134, month: 'May', date: 'May 14', ot: '2 Kings 17-18', nt: 'John 7:28-53', ps: 'Psalm 103:1-12', pr: 'Proverbs 15:8-10' },
    { day: 135, month: 'May', date: 'May 15', ot: '2 Kings 19-21', nt: 'John 8:1-20', ps: 'Psalm 103:13-22', pr: 'Proverbs 15:11' },
    { day: 136, month: 'May', date: 'May 16', ot: '2 Kings 22-23', nt: 'John 8:21-36', ps: 'Psalm 104:1-23', pr: 'Proverbs 15:12-14' },
    { day: 137, month: 'May', date: 'May 17', ot: '2 Kings 24-25', nt: 'John 8:37-59', ps: 'Psalm 104:24-35', pr: 'Proverbs 15:15-17' },
    { day: 138, month: 'May', date: 'May 18', ot: '1 Chronicles 1-3', nt: 'John 9:1-23', ps: 'Psalm 105:1-15', pr: 'Proverbs 15:18-19' },
    { day: 139, month: 'May', date: 'May 19', ot: '1 Chronicles 4-6', nt: 'John 9:24-41', ps: 'Psalm 105:16-36', pr: 'Proverbs 15:20-21' },
    { day: 140, month: 'May', date: 'May 20', ot: '1 Chronicles 7-9', nt: 'John 10:1-21', ps: 'Psalm 105:37-45', pr: 'Proverbs 15:22-23' },
    { day: 141, month: 'May', date: 'May 21', ot: '1 Chronicles 10-12', nt: 'John 10:22-42', ps: 'Psalm 106:1-12', pr: 'Proverbs 15:24-26' },
    { day: 142, month: 'May', date: 'May 22', ot: '1 Chronicles 13-15', nt: 'John 11:1-29', ps: 'Psalm 106:13-31', pr: 'Proverbs 15:27-28' },
    { day: 143, month: 'May', date: 'May 23', ot: '1 Chronicles 16-18', nt: 'John 11:30-57', ps: 'Psalm 106:32-48', pr: 'Proverbs 15:29-30' },
    { day: 144, month: 'May', date: 'May 24', ot: '1 Chronicles 19-21', nt: 'John 12:1-26', ps: 'Psalm 107:1-9', pr: 'Proverbs 15:31-32' },
    { day: 145, month: 'May', date: 'May 25', ot: '1 Chronicles 22-24', nt: 'John 12:27-50', ps: 'Psalm 107:10-22', pr: 'Proverbs 15:33' },
    { day: 146, month: 'May', date: 'May 26', ot: '1 Chronicles 25-27', nt: 'John 13:1-17', ps: 'Psalm 107:23-43', pr: 'Proverbs 16:1-3' },
    { day: 147, month: 'May', date: 'May 27', ot: '1 Chronicles 28-29', nt: 'John 13:18-38', ps: 'Psalm 108', pr: 'Proverbs 16:4-5' },
    { day: 148, month: 'May', date: 'May 28', ot: '2 Chronicles 1-3', nt: 'John 14', ps: 'Psalm 109:1-20', pr: 'Proverbs 16:6-7' },
    { day: 149, month: 'May', date: 'May 29', ot: '2 Chronicles 4-6', nt: 'John 15', ps: 'Psalm 109:21-31', pr: 'Proverbs 16:8-9' },
    { day: 150, month: 'May', date: 'May 30', ot: '2 Chronicles 7-9', nt: 'John 16', ps: 'Psalm 110', pr: 'Proverbs 16:10-11' },
    { day: 151, month: 'May', date: 'May 31', ot: '2 Chronicles 10-12', nt: 'John 17', ps: 'Psalm 111', pr: 'Proverbs 16:12-13' },
    
    // June (30 days)
    { day: 152, month: 'June', date: 'Jun 1', ot: '2 Chronicles 13-14', nt: 'John 18:1-24', ps: 'Psalm 112', pr: 'Proverbs 16:14-15' },
    { day: 153, month: 'June', date: 'Jun 2', ot: '2 Chronicles 15-16', nt: 'John 18:25-19:16', ps: 'Psalm 113', pr: 'Proverbs 16:16-17' },
    { day: 154, month: 'June', date: 'Jun 3', ot: '2 Chronicles 17-18', nt: 'John 19:17-42', ps: 'Psalm 114', pr: 'Proverbs 16:18' },
    { day: 155, month: 'June', date: 'Jun 4', ot: '2 Chronicles 19-20', nt: 'John 20', ps: 'Psalm 115', pr: 'Proverbs 16:19-20' },
    { day: 156, month: 'June', date: 'Jun 5', ot: '2 Chronicles 21-22', nt: 'John 21', ps: 'Psalm 116', pr: 'Proverbs 16:21-23' },
    { day: 157, month: 'June', date: 'Jun 6', ot: '2 Chronicles 23-24', nt: 'Acts 1', ps: 'Psalm 117', pr: 'Proverbs 16:24' },
    { day: 158, month: 'June', date: 'Jun 7', ot: '2 Chronicles 25-27', nt: 'Acts 2:1-21', ps: 'Psalm 118:1-18', pr: 'Proverbs 16:25' },
    { day: 159, month: 'June', date: 'Jun 8', ot: '2 Chronicles 28-29', nt: 'Acts 2:22-47', ps: 'Psalm 118:19-29', pr: 'Proverbs 16:26-27' },
    { day: 160, month: 'June', date: 'Jun 9', ot: '2 Chronicles 30-31', nt: 'Acts 3', ps: 'Psalm 119:1-16', pr: 'Proverbs 16:28-30' },
    { day: 161, month: 'June', date: 'Jun 10', ot: '2 Chronicles 32-33', nt: 'Acts 4:1-22', ps: 'Psalm 119:17-32', pr: 'Proverbs 16:31-33' },
    { day: 162, month: 'June', date: 'Jun 11', ot: '2 Chronicles 34-36', nt: 'Acts 4:23-37', ps: 'Psalm 119:33-48', pr: 'Proverbs 17:1' },
    { day: 163, month: 'June', date: 'Jun 12', ot: 'Ezra 1-2', nt: 'Acts 5:1-21', ps: 'Psalm 119:49-64', pr: 'Proverbs 17:2-3' },
    { day: 164, month: 'June', date: 'Jun 13', ot: 'Ezra 3-5', nt: 'Acts 5:22-42', ps: 'Psalm 119:65-80', pr: 'Proverbs 17:4-5' },
    { day: 165, month: 'June', date: 'Jun 14', ot: 'Ezra 6-8', nt: 'Acts 6', ps: 'Psalm 119:81-96', pr: 'Proverbs 17:6' },
    { day: 166, month: 'June', date: 'Jun 15', ot: 'Ezra 9-10', nt: 'Acts 7:1-21', ps: 'Psalm 119:97-112', pr: 'Proverbs 17:7-8' },
    { day: 167, month: 'June', date: 'Jun 16', ot: 'Nehemiah 1-3', nt: 'Acts 7:22-43', ps: 'Psalm 119:113-128', pr: 'Proverbs 17:9-11' },
    { day: 168, month: 'June', date: 'Jun 17', ot: 'Nehemiah 4-6', nt: 'Acts 7:44-60', ps: 'Psalm 119:129-152', pr: 'Proverbs 17:12-13' },
    { day: 169, month: 'June', date: 'Jun 18', ot: 'Nehemiah 7-9', nt: 'Acts 8:1-25', ps: 'Psalm 119:153-176', pr: 'Proverbs 17:14-15' },
    { day: 170, month: 'June', date: 'Jun 19', ot: 'Nehemiah 10-11', nt: 'Acts 8:26-40', ps: 'Psalm 120-122', pr: 'Proverbs 17:16' },
    { day: 171, month: 'June', date: 'Jun 20', ot: 'Nehemiah 12-13', nt: 'Acts 9:1-21', ps: 'Psalm 123-125', pr: 'Proverbs 17:17-18' },
    { day: 172, month: 'June', date: 'Jun 21', ot: 'Esther 1-2', nt: 'Acts 9:22-43', ps: 'Psalm 126-128', pr: 'Proverbs 17:19-21' },
    { day: 173, month: 'June', date: 'Jun 22', ot: 'Esther 3-5', nt: 'Acts 10:1-23', ps: 'Psalm 129-131', pr: 'Proverbs 17:22' },
    { day: 174, month: 'June', date: 'Jun 23', ot: 'Esther 6-8', nt: 'Acts 10:24-48', ps: 'Psalm 132-134', pr: 'Proverbs 17:23' },
    { day: 175, month: 'June', date: 'Jun 24', ot: 'Esther 9-10', nt: 'Acts 11', ps: 'Psalm 135-136', pr: 'Proverbs 17:24-25' },
    { day: 176, month: 'June', date: 'Jun 25', ot: 'Job 1-3', nt: 'Acts 12', ps: 'Psalm 137-138', pr: 'Proverbs 17:26' },
    { day: 177, month: 'June', date: 'Jun 26', ot: 'Job 4-7', nt: 'Acts 13:1-25', ps: 'Psalm 139', pr: 'Proverbs 17:27-28' },
    { day: 178, month: 'June', date: 'Jun 27', ot: 'Job 8-10', nt: 'Acts 13:26-52', ps: 'Psalm 140-141', pr: 'Proverbs 18:1' },
    { day: 179, month: 'June', date: 'Jun 28', ot: 'Job 11-13', nt: 'Acts 14', ps: 'Psalm 142-143', pr: 'Proverbs 18:2-3' },
    { day: 180, month: 'June', date: 'Jun 29', ot: 'Job 14-16', nt: 'Acts 15:1-21', ps: 'Psalm 144', pr: 'Proverbs 18:4-5' },
    { day: 181, month: 'June', date: 'Jun 30', ot: 'Job 17-19', nt: 'Acts 15:22-41', ps: 'Psalm 145', pr: 'Proverbs 18:6-7' },
    
    // July (31 days)
    { day: 182, month: 'July', date: 'Jul 1', ot: 'Job 20-21', nt: 'Acts 16:1-21', ps: 'Psalm 146-147', pr: 'Proverbs 18:8' },
    { day: 183, month: 'July', date: 'Jul 2', ot: 'Job 22-24', nt: 'Acts 16:22-40', ps: 'Psalm 148', pr: 'Proverbs 18:9-10' },
    { day: 184, month: 'July', date: 'Jul 3', ot: 'Job 25-27', nt: 'Acts 17:1-15', ps: 'Psalm 149-150', pr: 'Proverbs 18:11-12' },
    { day: 185, month: 'July', date: 'Jul 4', ot: 'Job 28-29', nt: 'Acts 17:16-34', ps: 'Psalm 1', pr: 'Proverbs 18:13' },
    { day: 186, month: 'July', date: 'Jul 5', ot: 'Job 30-31', nt: 'Acts 18', ps: 'Psalm 2', pr: 'Proverbs 18:14-15' },
    { day: 187, month: 'July', date: 'Jul 6', ot: 'Job 32-33', nt: 'Acts 19:1-20', ps: 'Psalm 3', pr: 'Proverbs 18:16-17' },
    { day: 188, month: 'July', date: 'Jul 7', ot: 'Job 34-35', nt: 'Acts 19:21-41', ps: 'Psalm 4', pr: 'Proverbs 18:18-19' },
    { day: 189, month: 'July', date: 'Jul 8', ot: 'Job 36-37', nt: 'Acts 20:1-16', ps: 'Psalm 5', pr: 'Proverbs 18:20-21' },
    { day: 190, month: 'July', date: 'Jul 9', ot: 'Job 38-40', nt: 'Acts 20:17-38', ps: 'Psalm 6', pr: 'Proverbs 18:22' },
    { day: 191, month: 'July', date: 'Jul 10', ot: 'Job 41-42', nt: 'Acts 21:1-17', ps: 'Psalm 7', pr: 'Proverbs 18:23-24' },
    { day: 192, month: 'July', date: 'Jul 11', ot: 'Ecclesiastes 1-3', nt: 'Acts 21:18-40', ps: 'Psalm 8', pr: 'Proverbs 19:1-3' },
    { day: 193, month: 'July', date: 'Jul 12', ot: 'Ecclesiastes 4-6', nt: 'Acts 22', ps: 'Psalm 9', pr: 'Proverbs 19:4-5' },
    { day: 194, month: 'July', date: 'Jul 13', ot: 'Ecclesiastes 7-9', nt: 'Acts 23:1-15', ps: 'Psalm 10', pr: 'Proverbs 19:6-7' },
    { day: 195, month: 'July', date: 'Jul 14', ot: 'Ecclesiastes 10-12', nt: 'Acts 23:16-35', ps: 'Psalm 11', pr: 'Proverbs 19:8-9' },
    { day: 196, month: 'July', date: 'Jul 15', ot: 'Song of Solomon 1-4', nt: 'Acts 24', ps: 'Psalm 12', pr: 'Proverbs 19:10-12' },
    { day: 197, month: 'July', date: 'Jul 16', ot: 'Song of Solomon 5-8', nt: 'Acts 25', ps: 'Psalm 13', pr: 'Proverbs 19:13-14' },
    { day: 198, month: 'July', date: 'Jul 17', ot: 'Isaiah 1-2', nt: 'Acts 26', ps: 'Psalm 14', pr: 'Proverbs 19:15-16' },
    { day: 199, month: 'July', date: 'Jul 18', ot: 'Isaiah 3-4', nt: 'Acts 27:1-26', ps: 'Psalm 15', pr: 'Proverbs 19:17' },
    { day: 200, month: 'July', date: 'Jul 19', ot: 'Isaiah 5-6', nt: 'Acts 27:27-44', ps: 'Psalm 16', pr: 'Proverbs 19:18-19' },
    { day: 201, month: 'July', date: 'Jul 20', ot: 'Isaiah 7-8', nt: 'Acts 28', ps: 'Psalm 17', pr: 'Proverbs 19:20-21' },
    { day: 202, month: 'July', date: 'Jul 21', ot: 'Isaiah 9-10', nt: 'Romans 1', ps: 'Psalm 18', pr: 'Proverbs 19:22-23' },
    { day: 203, month: 'July', date: 'Jul 22', ot: 'Isaiah 11-13', nt: 'Romans 2', ps: 'Psalm 19', pr: 'Proverbs 19:24-25' },
    { day: 204, month: 'July', date: 'Jul 23', ot: 'Isaiah 14-16', nt: 'Romans 3', ps: 'Psalm 20', pr: 'Proverbs 19:26' },
    { day: 205, month: 'July', date: 'Jul 24', ot: 'Isaiah 17-19', nt: 'Romans 4', ps: 'Psalm 21', pr: 'Proverbs 19:27-29' },
    { day: 206, month: 'July', date: 'Jul 25', ot: 'Isaiah 20-22', nt: 'Romans 5', ps: 'Psalm 22', pr: 'Proverbs 20:1' },
    { day: 207, month: 'July', date: 'Jul 26', ot: 'Isaiah 23-25', nt: 'Romans 6', ps: 'Psalm 23', pr: 'Proverbs 20:2-3' },
    { day: 208, month: 'July', date: 'Jul 27', ot: 'Isaiah 26-27', nt: 'Romans 7', ps: 'Psalm 24', pr: 'Proverbs 20:4-6' },
    { day: 209, month: 'July', date: 'Jul 28', ot: 'Isaiah 28-29', nt: 'Romans 8:1-21', ps: 'Psalm 25', pr: 'Proverbs 20:7' },
    { day: 210, month: 'July', date: 'Jul 29', ot: 'Isaiah 30-31', nt: 'Romans 8:22-39', ps: 'Psalm 26', pr: 'Proverbs 20:8-10' },
    { day: 211, month: 'July', date: 'Jul 30', ot: 'Isaiah 32-33', nt: 'Romans 9:1-15', ps: 'Psalm 27', pr: 'Proverbs 20:11' },
    { day: 212, month: 'July', date: 'Jul 31', ot: 'Isaiah 34-36', nt: 'Romans 9:16-33', ps: 'Psalm 28', pr: 'Proverbs 20:12' },
    
    // August (31 days)
    { day: 213, month: 'August', date: 'Aug 1', ot: 'Isaiah 37-38', nt: 'Romans 10', ps: 'Psalm 29', pr: 'Proverbs 20:13-15' },
    { day: 214, month: 'August', date: 'Aug 2', ot: 'Isaiah 39-40', nt: 'Romans 11:1-18', ps: 'Psalm 30', pr: 'Proverbs 20:16-18' },
    { day: 215, month: 'August', date: 'Aug 3', ot: 'Isaiah 41-42', nt: 'Romans 11:19-36', ps: 'Psalm 31', pr: 'Proverbs 20:19' },
    { day: 216, month: 'August', date: 'Aug 4', ot: 'Isaiah 43-44', nt: 'Romans 12', ps: 'Psalm 32', pr: 'Proverbs 20:20-21' },
    { day: 217, month: 'August', date: 'Aug 5', ot: 'Isaiah 45-46', nt: 'Romans 13', ps: 'Psalm 33', pr: 'Proverbs 20:22-23' },
    { day: 218, month: 'August', date: 'Aug 6', ot: 'Isaiah 47-49', nt: 'Romans 14', ps: 'Psalm 34', pr: 'Proverbs 20:24-25' },
    { day: 219, month: 'August', date: 'Aug 7', ot: 'Isaiah 50-52', nt: 'Romans 15:1-13', ps: 'Psalm 35', pr: 'Proverbs 20:26-27' },
    { day: 220, month: 'August', date: 'Aug 8', ot: 'Isaiah 53-55', nt: 'Romans 15:14-33', ps: 'Psalm 36', pr: 'Proverbs 20:28-30' },
    { day: 221, month: 'August', date: 'Aug 9', ot: 'Isaiah 56-58', nt: 'Romans 16', ps: 'Psalm 37', pr: 'Proverbs 21:1-2' },
    { day: 222, month: 'August', date: 'Aug 10', ot: 'Isaiah 59-61', nt: '1 Corinthians 1', ps: 'Psalm 38', pr: 'Proverbs 21:3' },
    { day: 223, month: 'August', date: 'Aug 11', ot: 'Isaiah 62-64', nt: '1 Corinthians 2', ps: 'Psalm 39', pr: 'Proverbs 21:4' },
    { day: 224, month: 'August', date: 'Aug 12', ot: 'Isaiah 65-66', nt: '1 Corinthians 3', ps: 'Psalm 40', pr: 'Proverbs 21:5-7' },
    { day: 225, month: 'August', date: 'Aug 13', ot: 'Jeremiah 1-2', nt: '1 Corinthians 4', ps: 'Psalm 41', pr: 'Proverbs 21:8-10' },
    { day: 226, month: 'August', date: 'Aug 14', ot: 'Jeremiah 3-5', nt: '1 Corinthians 5', ps: 'Psalm 42', pr: 'Proverbs 21:11-12' },
    { day: 227, month: 'August', date: 'Aug 15', ot: 'Jeremiah 6-8', nt: '1 Corinthians 6', ps: 'Psalm 43', pr: 'Proverbs 21:13' },
    { day: 228, month: 'August', date: 'Aug 16', ot: 'Jeremiah 9-11', nt: '1 Corinthians 7:1-24', ps: 'Psalm 44', pr: 'Proverbs 21:14-16' },
    { day: 229, month: 'August', date: 'Aug 17', ot: 'Jeremiah 12-14', nt: '1 Corinthians 7:25-40', ps: 'Psalm 45', pr: 'Proverbs 21:17-18' },
    { day: 230, month: 'August', date: 'Aug 18', ot: 'Jeremiah 15-17', nt: '1 Corinthians 8', ps: 'Psalm 46', pr: 'Proverbs 21:19-20' },
    { day: 231, month: 'August', date: 'Aug 19', ot: 'Jeremiah 18-19', nt: '1 Corinthians 9', ps: 'Psalm 47', pr: 'Proverbs 21:21-22' },
    { day: 232, month: 'August', date: 'Aug 20', ot: 'Jeremiah 20-21', nt: '1 Corinthians 10:1-18', ps: 'Psalm 48', pr: 'Proverbs 21:23-24' },
    { day: 233, month: 'August', date: 'Aug 21', ot: 'Jeremiah 22-23', nt: '1 Corinthians 10:19-11:1', ps: 'Psalm 49', pr: 'Proverbs 21:25-26' },
    { day: 234, month: 'August', date: 'Aug 22', ot: 'Jeremiah 24-26', nt: '1 Corinthians 11:2-34', ps: 'Psalm 50', pr: 'Proverbs 21:27' },
    { day: 235, month: 'August', date: 'Aug 23', ot: 'Jeremiah 27-29', nt: '1 Corinthians 12', ps: 'Psalm 51', pr: 'Proverbs 21:28-29' },
    { day: 236, month: 'August', date: 'Aug 24', ot: 'Jeremiah 30-31', nt: '1 Corinthians 13', ps: 'Psalm 52', pr: 'Proverbs 21:30-31' },
    { day: 237, month: 'August', date: 'Aug 25', ot: 'Jeremiah 32-33', nt: '1 Corinthians 14:1-20', ps: 'Psalm 53', pr: 'Proverbs 22:1' },
    { day: 238, month: 'August', date: 'Aug 26', ot: 'Jeremiah 34-36', nt: '1 Corinthians 14:21-40', ps: 'Psalm 54', pr: 'Proverbs 22:2-4' },
    { day: 239, month: 'August', date: 'Aug 27', ot: 'Jeremiah 37-39', nt: '1 Corinthians 15:1-34', ps: 'Psalm 55', pr: 'Proverbs 22:5-6' },
    { day: 240, month: 'August', date: 'Aug 28', ot: 'Jeremiah 40-42', nt: '1 Corinthians 15:35-58', ps: 'Psalm 56', pr: 'Proverbs 22:7' },
    { day: 241, month: 'August', date: 'Aug 29', ot: 'Jeremiah 43-45', nt: '1 Corinthians 16', ps: 'Psalm 57', pr: 'Proverbs 22:8-9' },
    { day: 242, month: 'August', date: 'Aug 30', ot: 'Jeremiah 46-47', nt: '2 Corinthians 1', ps: 'Psalm 58', pr: 'Proverbs 22:10-12' },
    { day: 243, month: 'August', date: 'Aug 31', ot: 'Jeremiah 48-49', nt: '2 Corinthians 2', ps: 'Psalm 59', pr: 'Proverbs 22:13' },
    
    // September (30 days)
    { day: 244, month: 'September', date: 'Sep 1', ot: 'Jeremiah 50', nt: '2 Corinthians 3', ps: 'Psalm 60', pr: 'Proverbs 22:14' },
    { day: 245, month: 'September', date: 'Sep 2', ot: 'Jeremiah 51-52', nt: '2 Corinthians 4', ps: 'Psalm 61', pr: 'Proverbs 22:15' },
    { day: 246, month: 'September', date: 'Sep 3', ot: 'Lamentations 1-2', nt: '2 Corinthians 5', ps: 'Psalm 62', pr: 'Proverbs 22:16' },
    { day: 247, month: 'September', date: 'Sep 4', ot: 'Lamentations 3-5', nt: '2 Corinthians 6', ps: 'Psalm 63', pr: 'Proverbs 22:17-19' },
    { day: 248, month: 'September', date: 'Sep 5', ot: 'Ezekiel 1-2', nt: '2 Corinthians 7', ps: 'Psalm 64', pr: 'Proverbs 22:20-21' },
    { day: 249, month: 'September', date: 'Sep 6', ot: 'Ezekiel 3-4', nt: '2 Corinthians 8', ps: 'Psalm 65', pr: 'Proverbs 22:22-23' },
    { day: 250, month: 'September', date: 'Sep 7', ot: 'Ezekiel 5-7', nt: '2 Corinthians 9', ps: 'Psalm 66', pr: 'Proverbs 22:24-25' },
    { day: 251, month: 'September', date: 'Sep 8', ot: 'Ezekiel 8-10', nt: '2 Corinthians 10', ps: 'Psalm 67', pr: 'Proverbs 22:26-27' },
    { day: 252, month: 'September', date: 'Sep 9', ot: 'Ezekiel 11-13', nt: '2 Corinthians 11', ps: 'Psalm 68', pr: 'Proverbs 22:28-29' },
    { day: 253, month: 'September', date: 'Sep 10', ot: 'Ezekiel 14-15', nt: '2 Corinthians 12', ps: 'Psalm 69', pr: 'Proverbs 23:1-3' },
    { day: 254, month: 'September', date: 'Sep 11', ot: 'Ezekiel 16', nt: '2 Corinthians 13', ps: 'Psalm 70', pr: 'Proverbs 23:4-5' },
    { day: 255, month: 'September', date: 'Sep 12', ot: 'Ezekiel 17-19', nt: 'Galatians 1', ps: 'Psalm 71', pr: 'Proverbs 23:6-8' },
    { day: 256, month: 'September', date: 'Sep 13', ot: 'Ezekiel 20-21', nt: 'Galatians 2', ps: 'Psalm 72', pr: 'Proverbs 23:9' },
    { day: 257, month: 'September', date: 'Sep 14', ot: 'Ezekiel 22-23', nt: 'Galatians 3', ps: 'Psalm 73', pr: 'Proverbs 23:10-11' },
    { day: 258, month: 'September', date: 'Sep 15', ot: 'Ezekiel 24-26', nt: 'Galatians 4', ps: 'Psalm 74', pr: 'Proverbs 23:12' },
    { day: 259, month: 'September', date: 'Sep 16', ot: 'Ezekiel 27-29', nt: 'Galatians 5', ps: 'Psalm 75', pr: 'Proverbs 23:13-14' },
    { day: 260, month: 'September', date: 'Sep 17', ot: 'Ezekiel 30-32', nt: 'Galatians 6', ps: 'Psalm 76', pr: 'Proverbs 23:15-16' },
    { day: 261, month: 'September', date: 'Sep 18', ot: 'Ezekiel 33-34', nt: 'Ephesians 1', ps: 'Psalm 77', pr: 'Proverbs 23:17-18' },
    { day: 262, month: 'September', date: 'Sep 19', ot: 'Ezekiel 35-36', nt: 'Ephesians 2', ps: 'Psalm 78', pr: 'Proverbs 23:19-21' },
    { day: 263, month: 'September', date: 'Sep 20', ot: 'Ezekiel 37-39', nt: 'Ephesians 3', ps: 'Psalm 79', pr: 'Proverbs 23:22' },
    { day: 264, month: 'September', date: 'Sep 21', ot: 'Ezekiel 40-41', nt: 'Ephesians 4', ps: 'Psalm 80', pr: 'Proverbs 23:23' },
    { day: 265, month: 'September', date: 'Sep 22', ot: 'Ezekiel 42-44', nt: 'Ephesians 5', ps: 'Psalm 81', pr: 'Proverbs 23:24' },
    { day: 266, month: 'September', date: 'Sep 23', ot: 'Ezekiel 45-46', nt: 'Ephesians 6', ps: 'Psalm 82', pr: 'Proverbs 23:25-28' },
    { day: 267, month: 'September', date: 'Sep 24', ot: 'Ezekiel 47-48', nt: 'Philippians 1', ps: 'Psalm 83', pr: 'Proverbs 23:29-35' },
    { day: 268, month: 'September', date: 'Sep 25', ot: 'Daniel 1-2', nt: 'Philippians 2', ps: 'Psalm 84', pr: 'Proverbs 24:1-2' },
    { day: 269, month: 'September', date: 'Sep 26', ot: 'Daniel 3-4', nt: 'Philippians 3', ps: 'Psalm 85', pr: 'Proverbs 24:3-4' },
    { day: 270, month: 'September', date: 'Sep 27', ot: 'Daniel 5-7', nt: 'Philippians 4', ps: 'Psalm 86', pr: 'Proverbs 24:5-6' },
    { day: 271, month: 'September', date: 'Sep 28', ot: 'Daniel 8-10', nt: 'Colossians 1', ps: 'Psalm 87', pr: 'Proverbs 24:7' },
    { day: 272, month: 'September', date: 'Sep 29', ot: 'Daniel 11-12', nt: 'Colossians 2', ps: 'Psalm 88', pr: 'Proverbs 24:8' },
    { day: 273, month: 'September', date: 'Sep 30', ot: 'Hosea 1-4', nt: 'Colossians 3', ps: 'Psalm 89', pr: 'Proverbs 24:9-10' },
    
    // October (31 days)
    { day: 274, month: 'October', date: 'Oct 1', ot: 'Hosea 5-8', nt: 'Colossians 4', ps: 'Psalm 90', pr: 'Proverbs 24:11-12' },
    { day: 275, month: 'October', date: 'Oct 2', ot: 'Hosea 9-11', nt: '1 Thessalonians 1', ps: 'Psalm 91', pr: 'Proverbs 24:13-14' },
    { day: 276, month: 'October', date: 'Oct 3', ot: 'Hosea 12-14', nt: '1 Thessalonians 2', ps: 'Psalm 92', pr: 'Proverbs 24:15-16' },
    { day: 277, month: 'October', date: 'Oct 4', ot: 'Joel 1-3', nt: '1 Thessalonians 3', ps: 'Psalm 93', pr: 'Proverbs 24:17-18' },
    { day: 278, month: 'October', date: 'Oct 5', ot: 'Amos 1-3', nt: '1 Thessalonians 4', ps: 'Psalm 94', pr: 'Proverbs 24:19-20' },
    { day: 279, month: 'October', date: 'Oct 6', ot: 'Amos 4-6', nt: '1 Thessalonians 5', ps: 'Psalm 95', pr: 'Proverbs 24:21-22' },
    { day: 280, month: 'October', date: 'Oct 7', ot: 'Amos 7-9', nt: '2 Thessalonians 1', ps: 'Psalm 96', pr: 'Proverbs 24:23-25' },
    { day: 281, month: 'October', date: 'Oct 8', ot: 'Obadiah-Jonah', nt: '2 Thessalonians 2', ps: 'Psalm 97', pr: 'Proverbs 24:26' },
    { day: 282, month: 'October', date: 'Oct 9', ot: 'Micah 1-3', nt: '2 Thessalonians 3', ps: 'Psalm 98', pr: 'Proverbs 24:27' },
    { day: 283, month: 'October', date: 'Oct 10', ot: 'Micah 4-5', nt: '1 Timothy 1', ps: 'Psalm 99', pr: 'Proverbs 24:28-29' },
    { day: 284, month: 'October', date: 'Oct 11', ot: 'Micah 6-7', nt: '1 Timothy 2', ps: 'Psalm 100', pr: 'Proverbs 24:30-34' },
    { day: 285, month: 'October', date: 'Oct 12', ot: 'Nahum 1-3', nt: '1 Timothy 3', ps: 'Psalm 101', pr: 'Proverbs 25:1-3' },
    { day: 286, month: 'October', date: 'Oct 13', ot: 'Habakkuk 1-3', nt: '1 Timothy 4', ps: 'Psalm 102', pr: 'Proverbs 25:4-5' },
    { day: 287, month: 'October', date: 'Oct 14', ot: 'Zephaniah 1-3', nt: '1 Timothy 5', ps: 'Psalm 103', pr: 'Proverbs 25:6-8' },
    { day: 288, month: 'October', date: 'Oct 15', ot: 'Haggai 1-2', nt: '1 Timothy 6', ps: 'Psalm 104', pr: 'Proverbs 25:9-10' },
    { day: 289, month: 'October', date: 'Oct 16', ot: 'Zechariah 1-4', nt: '2 Timothy 1', ps: 'Psalm 105', pr: 'Proverbs 25:11-14' },
    { day: 290, month: 'October', date: 'Oct 17', ot: 'Zechariah 5-8', nt: '2 Timothy 2', ps: 'Psalm 106', pr: 'Proverbs 25:15' },
    { day: 291, month: 'October', date: 'Oct 18', ot: 'Zechariah 9-12', nt: '2 Timothy 3', ps: 'Psalm 107', pr: 'Proverbs 25:16' },
    { day: 292, month: 'October', date: 'Oct 19', ot: 'Zechariah 13-14', nt: '2 Timothy 4', ps: 'Psalm 108', pr: 'Proverbs 25:17' },
    { day: 293, month: 'October', date: 'Oct 20', ot: 'Malachi 1-2', nt: 'Titus 1', ps: 'Psalm 109', pr: 'Proverbs 25:18-19' },
    { day: 294, month: 'October', date: 'Oct 21', ot: 'Malachi 3-4', nt: 'Titus 2', ps: 'Psalm 110', pr: 'Proverbs 25:20-22' },
    { day: 295, month: 'October', date: 'Oct 22', ot: 'Matthew 1-2', nt: 'Titus 3', ps: 'Psalm 111', pr: 'Proverbs 25:23-24' },
    { day: 296, month: 'October', date: 'Oct 23', ot: 'Matthew 3-4', nt: 'Philemon 1', ps: 'Psalm 112', pr: 'Proverbs 25:25-26' },
    { day: 297, month: 'October', date: 'Oct 24', ot: 'Matthew 5', nt: 'Hebrews 1', ps: 'Psalm 113', pr: 'Proverbs 25:27-28' },
    { day: 298, month: 'October', date: 'Oct 25', ot: 'Matthew 6-7', nt: 'Hebrews 2', ps: 'Psalm 114', pr: 'Proverbs 26:1-2' },
    { day: 299, month: 'October', date: 'Oct 26', ot: 'Matthew 8-9', nt: 'Hebrews 3', ps: 'Psalm 115', pr: 'Proverbs 26:3-5' },
    { day: 300, month: 'October', date: 'Oct 27', ot: 'Matthew 10-11', nt: 'Hebrews 4', ps: 'Psalm 116', pr: 'Proverbs 26:6-8' },
    { day: 301, month: 'October', date: 'Oct 28', ot: 'Matthew 12', nt: 'Hebrews 5', ps: 'Psalm 117', pr: 'Proverbs 26:9-12' },
    { day: 302, month: 'October', date: 'Oct 29', ot: 'Matthew 13', nt: 'Hebrews 6', ps: 'Psalm 118', pr: 'Proverbs 26:13-16' },
    { day: 303, month: 'October', date: 'Oct 30', ot: 'Matthew 14-15', nt: 'Hebrews 7', ps: 'Psalm 119:1-24', pr: 'Proverbs 26:17' },
    { day: 304, month: 'October', date: 'Oct 31', ot: 'Matthew 16-17', nt: 'Hebrews 8', ps: 'Psalm 119:25-48', pr: 'Proverbs 26:18-19' },
    
    // November (30 days)
    { day: 305, month: 'November', date: 'Nov 1', ot: 'Matthew 18', nt: 'Hebrews 9', ps: 'Psalm 119:49-72', pr: 'Proverbs 26:20' },
    { day: 306, month: 'November', date: 'Nov 2', ot: 'Matthew 19-20', nt: 'Hebrews 10:1-18', ps: 'Psalm 119:73-96', pr: 'Proverbs 26:21-22' },
    { day: 307, month: 'November', date: 'Nov 3', ot: 'Matthew 21', nt: 'Hebrews 10:19-39', ps: 'Psalm 119:97-120', pr: 'Proverbs 26:23' },
    { day: 308, month: 'November', date: 'Nov 4', ot: 'Matthew 22', nt: 'Hebrews 11:1-19', ps: 'Psalm 119:121-144', pr: 'Proverbs 26:24-26' },
    { day: 309, month: 'November', date: 'Nov 5', ot: 'Matthew 23', nt: 'Hebrews 11:20-40', ps: 'Psalm 119:145-176', pr: 'Proverbs 26:27-28' },
    { day: 310, month: 'November', date: 'Nov 6', ot: 'Matthew 24', nt: 'Hebrews 12', ps: 'Psalm 120-122', pr: 'Proverbs 27:1-2' },
    { day: 311, month: 'November', date: 'Nov 7', ot: 'Matthew 25', nt: 'Hebrews 13', ps: 'Psalm 123-125', pr: 'Proverbs 27:3' },
    { day: 312, month: 'November', date: 'Nov 8', ot: 'Matthew 26', nt: 'James 1', ps: 'Psalm 126-128', pr: 'Proverbs 27:4' },
    { day: 313, month: 'November', date: 'Nov 9', ot: 'Matthew 27', nt: 'James 2', ps: 'Psalm 129-131', pr: 'Proverbs 27:5-6' },
    { day: 314, month: 'November', date: 'Nov 10', ot: 'Matthew 28', nt: 'James 3', ps: 'Psalm 132-134', pr: 'Proverbs 27:7-9' },
    { day: 315, month: 'November', date: 'Nov 11', ot: 'Mark 1', nt: 'James 4', ps: 'Psalm 135-136', pr: 'Proverbs 27:10' },
    { day: 316, month: 'November', date: 'Nov 12', ot: 'Mark 2-3', nt: 'James 5', ps: 'Psalm 137-138', pr: 'Proverbs 27:11' },
    { day: 317, month: 'November', date: 'Nov 13', ot: 'Mark 4', nt: '1 Peter 1', ps: 'Psalm 139', pr: 'Proverbs 27:12' },
    { day: 318, month: 'November', date: 'Nov 14', ot: 'Mark 5', nt: '1 Peter 2', ps: 'Psalm 140-141', pr: 'Proverbs 27:13' },
    { day: 319, month: 'November', date: 'Nov 15', ot: 'Mark 6', nt: '1 Peter 3', ps: 'Psalm 142-143', pr: 'Proverbs 27:14' },
    { day: 320, month: 'November', date: 'Nov 16', ot: 'Mark 7', nt: '1 Peter 4', ps: 'Psalm 144', pr: 'Proverbs 27:15-16' },
    { day: 321, month: 'November', date: 'Nov 17', ot: 'Mark 8', nt: '1 Peter 5', ps: 'Psalm 145', pr: 'Proverbs 27:17' },
    { day: 322, month: 'November', date: 'Nov 18', ot: 'Mark 9', nt: '2 Peter 1', ps: 'Psalm 146-147', pr: 'Proverbs 27:18-20' },
    { day: 323, month: 'November', date: 'Nov 19', ot: 'Mark 10', nt: '2 Peter 2', ps: 'Psalm 148', pr: 'Proverbs 27:21-22' },
    { day: 324, month: 'November', date: 'Nov 20', ot: 'Mark 11', nt: '2 Peter 3', ps: 'Psalm 149-150', pr: 'Proverbs 27:23-27' },
    { day: 325, month: 'November', date: 'Nov 21', ot: 'Mark 12', nt: '1 John 1', ps: 'Psalm 1-2', pr: 'Proverbs 28:1' },
    { day: 326, month: 'November', date: 'Nov 22', ot: 'Mark 13', nt: '1 John 2', ps: 'Psalm 3-4', pr: 'Proverbs 28:2' },
    { day: 327, month: 'November', date: 'Nov 23', ot: 'Mark 14', nt: '1 John 3', ps: 'Psalm 5-6', pr: 'Proverbs 28:3-5' },
    { day: 328, month: 'November', date: 'Nov 24', ot: 'Mark 15', nt: '1 John 4', ps: 'Psalm 7-8', pr: 'Proverbs 28:6-7' },
    { day: 329, month: 'November', date: 'Nov 25', ot: 'Mark 16', nt: '1 John 5', ps: 'Psalm 9', pr: 'Proverbs 28:8-9' },
    { day: 330, month: 'November', date: 'Nov 26', ot: 'Luke 1:1-38', nt: '2 John 1', ps: 'Psalm 10', pr: 'Proverbs 28:10' },
    { day: 331, month: 'November', date: 'Nov 27', ot: 'Luke 1:39-80', nt: '3 John 1', ps: 'Psalm 11-12', pr: 'Proverbs 28:11' },
    { day: 332, month: 'November', date: 'Nov 28', ot: 'Luke 2', nt: 'Jude 1', ps: 'Psalm 13-14', pr: 'Proverbs 28:12-13' },
    { day: 333, month: 'November', date: 'Nov 29', ot: 'Luke 3', nt: 'Revelation 1', ps: 'Psalm 15-16', pr: 'Proverbs 28:14' },
    { day: 334, month: 'November', date: 'Nov 30', ot: 'Luke 4', nt: 'Revelation 2', ps: 'Psalm 17', pr: 'Proverbs 28:15-16' },
    
    // December (31 days)
    { day: 335, month: 'December', date: 'Dec 1', ot: 'Luke 5', nt: 'Revelation 3', ps: 'Psalm 18', pr: 'Proverbs 28:17-18' },
    { day: 336, month: 'December', date: 'Dec 2', ot: 'Luke 6', nt: 'Revelation 4', ps: 'Psalm 19', pr: 'Proverbs 28:19-20' },
    { day: 337, month: 'December', date: 'Dec 3', ot: 'Luke 7', nt: 'Revelation 5', ps: 'Psalm 20-21', pr: 'Proverbs 28:21-22' },
    { day: 338, month: 'December', date: 'Dec 4', ot: 'Luke 8', nt: 'Revelation 6', ps: 'Psalm 22', pr: 'Proverbs 28:23-24' },
    { day: 339, month: 'December', date: 'Dec 5', ot: 'Luke 9', nt: 'Revelation 7', ps: 'Psalm 23-24', pr: 'Proverbs 28:25-26' },
    { day: 340, month: 'December', date: 'Dec 6', ot: 'Luke 10', nt: 'Revelation 8', ps: 'Psalm 25', pr: 'Proverbs 28:27-28' },
    { day: 341, month: 'December', date: 'Dec 7', ot: 'Luke 11', nt: 'Revelation 9', ps: 'Psalm 26-27', pr: 'Proverbs 29:1' },
    { day: 342, month: 'December', date: 'Dec 8', ot: 'Luke 12', nt: 'Revelation 10', ps: 'Psalm 28-29', pr: 'Proverbs 29:2-4' },
    { day: 343, month: 'December', date: 'Dec 9', ot: 'Luke 13', nt: 'Revelation 11', ps: 'Psalm 30', pr: 'Proverbs 29:5-8' },
    { day: 344, month: 'December', date: 'Dec 10', ot: 'Luke 14', nt: 'Revelation 12', ps: 'Psalm 31', pr: 'Proverbs 29:9-11' },
    { day: 345, month: 'December', date: 'Dec 11', ot: 'Luke 15', nt: 'Revelation 13', ps: 'Psalm 32', pr: 'Proverbs 29:12-14' },
    { day: 346, month: 'December', date: 'Dec 12', ot: 'Luke 16', nt: 'Revelation 14', ps: 'Psalm 33', pr: 'Proverbs 29:15-17' },
    { day: 347, month: 'December', date: 'Dec 13', ot: 'Luke 17', nt: 'Revelation 15', ps: 'Psalm 34', pr: 'Proverbs 29:18' },
    { day: 348, month: 'December', date: 'Dec 14', ot: 'Luke 18', nt: 'Revelation 16', ps: 'Psalm 35', pr: 'Proverbs 29:19-20' },
    { day: 349, month: 'December', date: 'Dec 15', ot: 'Luke 19', nt: 'Revelation 17', ps: 'Psalm 36', pr: 'Proverbs 29:21-22' },
    { day: 350, month: 'December', date: 'Dec 16', ot: 'Luke 20', nt: 'Revelation 18', ps: 'Psalm 37', pr: 'Proverbs 29:23' },
    { day: 351, month: 'December', date: 'Dec 17', ot: 'Luke 21', nt: 'Revelation 19', ps: 'Psalm 38', pr: 'Proverbs 29:24-25' },
    { day: 352, month: 'December', date: 'Dec 18', ot: 'Luke 22', nt: 'Revelation 20', ps: 'Psalm 39', pr: 'Proverbs 29:26-27' },
    { day: 353, month: 'December', date: 'Dec 19', ot: 'Luke 23', nt: 'Revelation 21', ps: 'Psalm 40', pr: 'Proverbs 30:1-6' },
    { day: 354, month: 'December', date: 'Dec 20', ot: 'Luke 24', nt: 'Revelation 22', ps: 'Psalm 41', pr: 'Proverbs 30:7-9' },
    { day: 355, month: 'December', date: 'Dec 21', ot: 'John 1', nt: 'Genesis 1-2', ps: 'Psalm 42-43', pr: 'Proverbs 30:10' },
    { day: 356, month: 'December', date: 'Dec 22', ot: 'John 2-3', nt: 'Genesis 3-4', ps: 'Psalm 44', pr: 'Proverbs 30:11-14' },
    { day: 357, month: 'December', date: 'Dec 23', ot: 'John 4', nt: 'Genesis 5-6', ps: 'Psalm 45', pr: 'Proverbs 30:15-16' },
    { day: 358, month: 'December', date: 'Dec 24', ot: 'John 5', nt: 'Genesis 7-8', ps: 'Psalm 46-47', pr: 'Proverbs 30:17' },
    { day: 359, month: 'December', date: 'Dec 25', ot: 'John 6', nt: 'Genesis 9-10', ps: 'Psalm 48', pr: 'Proverbs 30:18-20' },
    { day: 360, month: 'December', date: 'Dec 26', ot: 'John 7', nt: 'Genesis 11', ps: 'Psalm 49', pr: 'Proverbs 30:21-23' },
    { day: 361, month: 'December', date: 'Dec 27', ot: 'John 8', nt: 'Genesis 12', ps: 'Psalm 50', pr: 'Proverbs 30:24-28' },
    { day: 362, month: 'December', date: 'Dec 28', ot: 'John 9', nt: 'Genesis 13-14', ps: 'Psalm 51', pr: 'Proverbs 30:29-31' },
    { day: 363, month: 'December', date: 'Dec 29', ot: 'John 10', nt: 'Genesis 15-16', ps: 'Psalm 52-54', pr: 'Proverbs 30:32-33' },
    { day: 364, month: 'December', date: 'Dec 30', ot: 'John 11', nt: 'Genesis 17', ps: 'Psalm 55', pr: 'Proverbs 31:1-9' },
    { day: 365, month: 'December', date: 'Dec 31', ot: 'John 12', nt: 'Genesis 18', ps: 'Psalm 56-57', pr: 'Proverbs 31:10-31' }
  ];

  function getMonthName(day) {
    // Days per month: Jan(31), Feb(28), Mar(31), Apr(30), May(31), Jun(30), 
    //                 Jul(31), Aug(31), Sep(30), Oct(31), Nov(30), Dec(31)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    let currentDay = day;
    for (let i = 0; i < 12; i++) {
      if (currentDay <= daysInMonth[i]) {
        return months[i];
      }
      currentDay -= daysInMonth[i];
    }
    return 'December'; // Fallback for day 365+
  }

  function getDateString(day) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    let currentDay = day;
    for (let i = 0; i < 12; i++) {
      if (currentDay <= daysInMonth[i]) {
        return `${months[i]} ${currentDay}`;
      }
      currentDay -= daysInMonth[i];
    }
    return `Dec ${day - 334}`; // Fallback
  }

  const filteredReadings = view === 'calendar' 
    ? readingPlan.filter(r => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
        return r.month === months[selectedMonth - 1];
      })
    : readingPlan;

  const progressPercentage = ((completedDays.length / 365) * 100).toFixed(1);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "One Year Bible Reading Plan",
    "description": "Complete one year Bible reading plan with daily readings from Old Testament, New Testament, Psalms and Proverbs. Track your progress through the entire Bible.",
    "url": window.location.href,
    "publisher": {
      "@type": "Organization",
      "name": "Christ AG Church Kazhakkoottam",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, Mak Tower, National Highway",
        "addressLocality": "Kazhakkoottam",
        "addressRegion": "Kerala",
        "postalCode": "695582",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <div className="bible-reading-page-wrapper">
      <Helmet>
        <title>One Year Bible Reading Plan | ഒരു വർഷം ബൈബിൾ വായനാ പദ്ധതി | Christ AG Church</title>
        <meta name="description" content="Complete your Bible in one year with our structured reading plan. Daily readings from Old Testament, New Testament, Psalms, and Proverbs. Track your progress and grow spiritually." />
        <meta name="keywords" content="Bible reading plan, one year Bible, daily Bible reading, Christian devotion, scripture reading, Bible study, Malayalam Bible, ബൈബിൾ വായന, Christ AG Church, Kazhakkoottam" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="One Year Bible Reading Plan - Christ AG Church Kazhakkoottam" />
        <meta property="og:description" content="Complete your Bible in one year with daily readings from OT, NT, Psalms, and Proverbs. Track your progress and grow spiritually." />
        <meta property="og:image" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:image:secure_url" content={`${window.location.origin}/logo512.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="Christ AG Church Kazhakkoottam - Bible Reading Plan" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Christ AG Church Kazhakkoottam" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="ml_IN" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="One Year Bible Reading Plan - Christ AG Church" />
        <meta name="twitter:description" content="Complete your Bible in one year with daily readings. Track your progress and grow spiritually." />
        <meta name="twitter:image" content={`${window.location.origin}/logo512.png`} />
        <meta name="twitter:image:alt" content="Christ AG Church Kazhakkoottam" />
        
        {/* Additional SEO tags */}
        <meta name="author" content="Christ AG Church Kazhakkoottam" />
        <meta name="language" content="English, Malayalam" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.href} />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <button className="bible-back-home-btn" onClick={() => navigate('/')}>← Back to Home</button>
      
      <div className="bible-reading-container">
        <div className="bible-reading-header">
          <div className="bible-header-layout">
            <img src={churchLogo} alt="Christ AG Church" className="bible-header-logo" />
            <div className="bible-header-content">
              <p className="bible-church-name">Christ AG Church, Kazhakkoottam</p>
              <h1>One Year Bible Reading Plan</h1>
              <p className="bible-malayalam-title">ഒരു വർഷം ബൈബിൾ വായനാ പദ്ധതി</p>
              <p className="bible-subtitle">Read through the entire Bible in one year</p>
            </div>
          </div>
        
        <div className="bible-progress-section">
          <div className="bible-progress-stats">
            <div className="bible-stat">
              <span className="bible-stat-number">{completedDays.length}</span>
              <span className="bible-stat-label">Days Completed</span>
            </div>
            <div className="bible-stat">
              <span className="bible-stat-number">{365 - completedDays.length}</span>
              <span className="bible-stat-label">Days Remaining</span>
            </div>
            <div className="bible-stat">
              <span className="bible-stat-number">{progressPercentage}%</span>
              <span className="bible-stat-label">Progress</span>
            </div>
          </div>
          <div className="bible-progress-bar">
            <div className="bible-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bible-reading-controls">
        <div className="bible-view-toggle">
          <button 
            className={view === 'list' ? 'bible-active' : ''} 
            onClick={() => setView('list')}
          >
            📋 List View
          </button>
          <button 
            className={view === 'calendar' ? 'bible-active' : ''} 
            onClick={() => setView('calendar')}
          >
            📅 Calendar View
          </button>
        </div>

        {view === 'calendar' && (
          <div className="bible-month-selector">
            <button onClick={() => setSelectedMonth(Math.max(1, selectedMonth - 1))}>‹</button>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                <option key={i + 1} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>
            <button onClick={() => setSelectedMonth(Math.min(12, selectedMonth + 1))}>›</button>
          </div>
        )}

        <button className="bible-jump-to-today" onClick={() => {
          // Switch to list view to show current day
          setView('list');
          // Wait for re-render, then scroll
          setTimeout(() => {
            const element = document.getElementById(`day-${currentDay}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }}>
          📍 Today's Reading
        </button>

        <button className="bible-share-btn" onClick={handleShare}>
          🔗 Share
        </button>
      </div>

      <div className={`bible-reading-plan ${view}`}>
        {filteredReadings.map((reading) => (
          <div 
            key={reading.day} 
            id={`day-${reading.day}`}
            className={`bible-reading-day ${completedDays.includes(reading.day) ? 'bible-completed' : ''} ${reading.day === currentDay ? 'bible-current' : ''}`}
          >
            <div className="bible-day-header">
              <div className="bible-day-info">
                <span className="bible-day-number">Day {reading.day}</span>
                <span className="bible-day-date">{reading.date}</span>
                {reading.day === currentDay && <span className="bible-today-badge">Today</span>}
              </div>
              <button 
                className="bible-complete-checkbox"
                onClick={() => toggleDayCompletion(reading.day)}
                aria-label={completedDays.includes(reading.day) ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {completedDays.includes(reading.day) ? '✓' : '○'}
              </button>
            </div>
            
            <div className="bible-reading-sections">
              <div className="bible-reading-item">
                <span className="bible-reading-label">📖 Old Testament</span>
                <span className="bible-reading-text">{reading.ot}</span>
              </div>
              <div className="bible-reading-item">
                <span className="bible-reading-label">✝️ New Testament</span>
                <span className="bible-reading-text">{reading.nt}</span>
              </div>
              <div className="bible-reading-item">
                <span className="bible-reading-label">🎵 Psalm</span>
                <span className="bible-reading-text">{reading.ps}</span>
              </div>
              <div className="bible-reading-item">
                <span className="bible-reading-label">💡 Proverbs</span>
                <span className="bible-reading-text">{reading.pr}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bible-info-footer">
        <div className="bible-info-section">
          <h3>About This Plan</h3>
          <p>
            This reading plan will take you through the entire Bible in one year. 
            Each day includes readings from the Old Testament, New Testament, Psalms, and Proverbs.
            Check off each day as you complete it to track your progress.
          </p>
        </div>
        
        <div className="bible-info-section bible-malayalam-section">
          <h3>ഈ പദ്ധതിയെക്കുറിച്ച്</h3>
          <p>
            ഈ വായനാ പദ്ധതി നിങ്ങളെ ഒരു വർഷത്തിനുള്ളിൽ മുഴുവൻ ബൈബിളിലൂടെയും കൊണ്ടുപോകും. 
            ഓരോ ദിവസവും പഴയനിയമം, പുതിയനിയമം, സങ്കീർത്തനങ്ങൾ, സദൃശ്യവാക്യങ്ങൾ എന്നിവയിൽ നിന്നുള്ള വായനകൾ ഉൾപ്പെടുന്നു.
            നിങ്ങളുടെ പുരോഗതി ട്രാക്ക് ചെയ്യാൻ ഓരോ ദിവസവും പൂർത്തിയാക്കുമ്പോൾ ചെക്ക് ചെയ്യുക.
          </p>
          <p>
            ദൈവവചനം നിങ്ങളുടെ ജീവിതത്തിൽ രൂപാന്തരീകരണ ശക്തിയായി മാറട്ടെ. ദിവസേന വായിക്കുന്നതിലൂടെ, 
            ദൈവത്തിന്റെ സ്നേഹവും ലക്ഷ്യവും നിങ്ങൾക്ക് ആഴത്തിൽ മനസ്സിലാക്കാൻ കഴിയും. ഈ യാത്രയിൽ 
            സ്ഥിരോത്സാഹത്തോടെ തുടരുക, കാരണം ദൈവത്തിന്റെ വചനം നിങ്ങളുടെ പാദത്തിനു ദീപവും 
            മാർഗത്തിനു പ്രകാശവുമാണ് (സങ്കീർത്തനം 119:105).
          </p>
        </div>
        
        <div className="bible-tips-section">
          <h3>Reading Tips</h3>
          <ul>
            <li>Set a consistent time each day for reading</li>
            <li>Find a quiet place free from distractions</li>
            <li>Pray before reading for understanding</li>
            <li>Take notes on meaningful verses</li>
            <li>Don't worry if you miss a day - just continue</li>
          </ul>
        </div>
      </div>
    </div>

      <div className="bible-footer">
        <div className="bible-footer-content">
          <h3>Christ AG Church Kazhakkoottam</h3>
          <p>2nd Floor, Mak Tower, National Highway, Kazhakkoottam</p>
          <p>Thiruvananthapuram, Kerala 695582</p>
        </div>
      </div>

      {showScrollTop && (
        <button 
          className="bible-scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default BibleReadingPlan;
