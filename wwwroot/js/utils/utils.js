const getErrorMessage = (status) => {
    switch (status) {
        case 400:
            return 'Felaktiga uppgifter. Kontrollera det du har fyllt i.';

        case 401:
            return 'Du måste logga in.';

        case 403:
            return 'Du har inte behörighet att göra detta.';

        case 404:
            return 'Det som efterfrågades kunde inte hittas.';

        case 429:
            return 'För många försök. Försök igen senare.';

        case 500:
            return 'Ett serverfel uppstod.';

        default:
            return 'Något gick fel.';
    }
};