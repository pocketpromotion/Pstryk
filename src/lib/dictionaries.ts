export type Dictionary = {
    common: {
        loading: string;
        error: string;
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        create: string;
        back: string;
        yes: string;
        no: string;
        filterByTag: string;
        allTags: string;
        sortByDate: string;
        newestFirst: string;
        oldestFirst: string;
        unknown: string;
    };
    nav: {
        home: string;
        groups: string;
        admin: string;
        logout: string;
        login: string;
        register: string;
    };
    auth: {
        loginTitle: string;
        registerTitle: string;
        email: string;
        password: string;
        name: string;
        signIn: string;
        signUp: string;
        noAccount: string;
        hasAccount: string;
        loginError: string;
        registerError: string;
        passwordRequirements: string;
    };
    groups: {
        myGroups: string;
        createGroup: string;
        groupName: string;
        create: string;
        members: string;
        invite: string;
        upload: string;
        noPhotos: string;
        thumbnail: string;
        photosCount: string;
    };
    photos: {
        uploadTitle: string;
        selectFile: string;
        title: string;
        description: string;
        tags: string;
        tagsPlaceholder: string;
        upload: string;
        noPhotos: string;
        untitled: string;
        download: string;
        editDetails: string;
        uploadedBy: string;
        noDescription: string;
    };
    admin: {
        dashboard: string;
        users: string;
        groups: string;
        role: string;
        actions: string;
        makeAdmin: string;
        makeUser: string;
        deleteUser: string;
        deleteGroup: string;
        manageMembers: string;
        addUser: string;
        editUser: string;
        createUser: string;
    };
    home: {
        title: string;
        subtitle: string;
        goToGroups: string;
        signIn: string;
        createAccount: string;
    };
    profile: {
        title: string;
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
        updateProfile: string;
        success: string;
        passwordMismatch: string;
        wrongPassword: string;
    };
};

export const pl: Dictionary = {
    common: {
        loading: "Ładowanie...",
        error: "Wystąpił błąd",
        save: "Zapisz",
        cancel: "Anuluj",
        delete: "Usuń",
        edit: "Edytuj",
        create: "Utwórz",
        back: "Wstecz",
        yes: "Tak",
        no: "Nie",
        filterByTag: "Filtruj po tagu",
        allTags: "Wszystkie tagi",
        sortByDate: "Sortuj po dacie",
        newestFirst: "Najnowsze",
        oldestFirst: "Najstarsze",
        unknown: "Nieznany",
    },
    nav: {
        home: "Strona główna",
        groups: "Grupy",
        admin: "Admin",
        logout: "Wyloguj",
        login: "Zaloguj",
        register: "Rejestracja",
    },
    auth: {
        loginTitle: "Zaloguj się",
        registerTitle: "Zarejestruj się",
        email: "Email",
        password: "Hasło",
        name: "Imię",
        signIn: "Zaloguj się",
        signUp: "Zarejestruj się",
        noAccount: "Nie masz konta? Zarejestruj się",
        hasAccount: "Masz już konto? Zaloguj się",
        loginError: "Błąd logowania",
        registerError: "Błąd rejestracji",
        passwordRequirements: "Hasło musi mieć min. 8 znaków, cyfrę i znak specjalny.",
    },
    groups: {
        myGroups: "Moje Grupy",
        createGroup: "Utwórz Grupę",
        groupName: "Nazwa Grupy",
        create: "Utwórz",
        members: "Członkowie",
        invite: "Zaproś",
        upload: "Dodaj Zdjęcie",
        noPhotos: "Brak zdjęć w tej grupie.",
        thumbnail: "Miniaturka",
        photosCount: "zdjęć",
    },
    photos: {
        uploadTitle: "Dodaj Zdjęcie",
        selectFile: "Wybierz plik",
        title: "Tytuł",
        description: "Opis",
        tags: "Tagi",
        tagsPlaceholder: "Tagi (oddzielone przecinkami)",
        upload: "Prześlij",
        noPhotos: "Brak zdjęć spełniających kryteria.",
        untitled: "Bez tytułu",
        download: "Pobierz",
        editDetails: "Edytuj szczegóły",
        uploadedBy: "przez",
        noDescription: "Brak opisu.",
    },
    admin: {
        dashboard: "Panel Administratora",
        users: "Użytkownicy",
        groups: "Grupy",
        role: "Rola",
        actions: "Akcje",
        makeAdmin: "Mianuj Adminem",
        makeUser: "Mianuj Użytkownikiem",
        deleteUser: "Usuń Użytkownika",
        deleteGroup: "Usuń Grupę",
        manageMembers: "Zarządzaj Członkami",
        addUser: "Dodaj Użytkownika",
        editUser: "Edytuj Użytkownika",
        createUser: "Utwórz Użytkownika",
    },
    home: {
        title: "Pstryk",
        subtitle: "Dziel się chwilami z przyjaciółmi i rodziną.",
        goToGroups: "Przejdź do Grup",
        signIn: "Zaloguj się",
        createAccount: "Utwórz Konto",
    },
    profile: {
        title: "Twój Profil",
        currentPassword: "Obecne Hasło",
        newPassword: "Nowe Hasło",
        confirmNewPassword: "Potwierdź Nowe Hasło",
        updateProfile: "Zaktualizuj Profil",
        success: "Profil zaktualizowany pomyślnie",
        passwordMismatch: "Hasła nie są identyczne",
        wrongPassword: "Nieprawidłowe obecne hasło",
    },
};

export const en: Dictionary = {
    common: {
        loading: "Loading...",
        error: "An error occurred",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        back: "Back",
        yes: "Yes",
        no: "No",
        filterByTag: "Filter by Tag",
        allTags: "All Tags",
        sortByDate: "Sort by Date",
        newestFirst: "Newest First",
        oldestFirst: "Oldest First",
        unknown: "Unknown",
    },
    nav: {
        home: "Home",
        groups: "Groups",
        admin: "Admin",
        logout: "Logout",
        login: "Login",
        register: "Register",
    },
    auth: {
        loginTitle: "Sign In",
        registerTitle: "Sign Up",
        email: "Email",
        password: "Password",
        name: "Name",
        signIn: "Sign In",
        signUp: "Sign Up",
        noAccount: "Don't have an account? Sign up",
        hasAccount: "Already have an account? Sign in",
        loginError: "Login failed",
        registerError: "Registration failed",
        passwordRequirements: "Password must be 8+ chars, with digit & special char.",
    },
    groups: {
        myGroups: "My Groups",
        createGroup: "Create Group",
        groupName: "Group Name",
        create: "Create",
        members: "Members",
        invite: "Invite",
        upload: "Upload Photo",
        noPhotos: "No photos in this group.",
        thumbnail: "Thumbnail",
        photosCount: "photos",
    },
    photos: {
        uploadTitle: "Upload Photo",
        selectFile: "Select File",
        title: "Title",
        description: "Description",
        tags: "Tags",
        tagsPlaceholder: "Tags (comma separated)",
        upload: "Upload",
        noPhotos: "No photos found matching your criteria.",
        untitled: "Untitled",
        download: "Download",
        editDetails: "Edit Details",
        uploadedBy: "by",
        noDescription: "No description provided.",
    },
    admin: {
        dashboard: "Admin Dashboard",
        users: "Users",
        groups: "Groups",
        role: "Role",
        actions: "Actions",
        makeAdmin: "Make Admin",
        makeUser: "Make User",
        deleteUser: "Delete User",
        deleteGroup: "Delete Group",
        manageMembers: "Manage Members",
        addUser: "Add User",
        editUser: "Edit User",
        createUser: "Create User",
    },
    home: {
        title: "Pstryk",
        subtitle: "Share your moments with friends and family.",
        goToGroups: "Go to Groups",
        signIn: "Sign In",
        createAccount: "Create Account",
    },
    profile: {
        title: "Your Profile",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmNewPassword: "Confirm New Password",
        updateProfile: "Update Profile",
        success: "Profile updated successfully",
        passwordMismatch: "New passwords do not match",
        wrongPassword: "Incorrect current password",
    },
};
