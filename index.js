const { promises: fs } = require('fs');
const readme = require('./readme');

const msInOneDay = 1000 * 60 * 60 * 24;

const today = new Date();

function generateNewREADME() {
    const readmeRow = readme.split('\n');

    function updateIdentifier(identifier, replaceText) {
        const identifierIndex = findIdentifierIndex(readmeRow, identifier);
        readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
            `<#${identifier}>`,
            replaceText
        );
    }

    const identifierToUpdate = {
        // * DBNW = Day Before New Year
        getAge: getAge(),
        day_before_new_years: getDBNWSentence(),
        age_and_birthday: getAgeAndBirthdaySentence(),
        myself: getMySelf(),
        today_date: getTodayDate(),
        dimbot_signing: getDimbotSigning(),
    };

    Object.entries(identifierToUpdate).forEach(([key, value]) => {
        updateIdentifier(key, value);
    });

    return readmeRow.join('\n');
}

const moodByDay = {
    1: 'hate',
    2: 'wickedness',
    3: 'pleasure',
    4: 'wickedness',
    5: 'cruelty',
    6: 'horror',
    7: 'love',
};

function getDimbotSigning() {
    const mood = moodByDay[today.getDay()];
    return `🤖 This README.md is updated with ${mood}, by Dimbot 🦁️`;
}

function getTodayDate() {
    return today.toDateString();
}

function getMySelf() {
    // test if we are in a PAIR DAY
    return today.getDate() % 2 === 0
        ? Math.floor(Math.random() * 2)
            ? 'Lion 🦁️'
            : 'Eagle 🦅'
        : 'lion eagle 🦁🦅';
}

function getAge(){
    const birthday = new Date('2000-08-03T00:00:00.000Z');

    const diffBirthdayToToday = today - birthday;

    // to get my current ages
    const age = new Date(diffBirthdayToToday).getFullYear() - 1970;
    return `I am ${age} years old`;
}

function getAgeAndBirthdaySentence() {
    const birthday = new Date('2000-08-03T00:00:00.000Z');

    const diffBirthdayToToday = today - birthday;

    // to get my current ages
    const age = new Date(diffBirthdayToToday).getFullYear() - 1970;

    if (
        birthday.getDate() === today.getDate() &&
        birthday.getMonth() === today.getMonth()
    )
        return `Today is my birthday🎉! I am ${age} years old.`;

    const birthdatetoday = new Date(birthday.setYear(today.getFullYear()));
    const isBirthdayRaised = today - birthdatetoday > 0;

    const nextBirthdayYear = birthday.getFullYear() + (isBirthdayRaised ? 1 : 0);
    const nextBirthdayDate = new Date(birthday.getTime());
    nextBirthdayDate.setYear(nextBirthdayYear);

    const timeUntilBirthday = nextBirthdayDate - today;
    const dayUntilBirthday = Math.round(timeUntilBirthday / msInOneDay);

    return `I am ${age} years old... But I will be ${
        age + 1
    } in ${dayUntilBirthday} days 🎉`;
}

function getDBNWSentence() {
    const nextYear = today.getFullYear() + 1;
    const nextYearDate = new Date(String(nextYear));

    const timeUntilNewYear = nextYearDate - today;
    const dayUntilNewYear = Math.round(timeUntilNewYear / msInOneDay);

    return `**${dayUntilNewYear} day before ${nextYear} ⏱**`;
}

const findIdentifierIndex = (rows, identifier) =>
    rows.findIndex((r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));

const updateREADMEFile = (text) =>
    fs.writeFile('./README.md', text, () => console.log(text));

function main() {
    const newREADME = generateNewREADME();
    console.log(newREADME);
    updateREADMEFile(newREADME);
}
main();