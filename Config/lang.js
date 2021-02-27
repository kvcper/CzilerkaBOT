module.exports={
	commandNotFound: "**<:nie:767387690248437840> | Nie ma takiej komendy.**",
	noUser: "**<:nie:767387690248437840> | Nie ma takiego użytkownika.**",
	invalidNumber: "**<:nie:767387690248437840> | Należy podać poprawną liczbę**",
	noPermission: "**<:nie:767387690248437840> | Nie masz uprawnień.**",
	noTargetUser: "**<:nie:767387690248437840> | Musisz podać docelowego użytkownika.**",
	noAmount: "**<:nie:767387690248437840> | Musisz podać ilość.**",
	onlyPositive: "**<:nie:767387690248437840> | Ilość czokobonsów musi być dodatnia.**",
	notEnoughInBank: "**<:nie:767387690248437840> | Nie masz tyle czokobonsów w banku.**",
	notEnough: "**<:nie:767387690248437840> | Nie masz tyle czokobonsów.**",
	noShopItemId: "**<:nie:767387690248437840> | Podaj produkt jaki chcesz kupić.**",
	noShopItem: "**<:nie:767387690248437840> | Nie ma takiego przedmiotu w sklepie.**",
	unknownError: "**<:nie:767387690248437840> | Nieznany błąd.**",
	economyResetted: "** Zrestartowano ekonomię.**",
	alreadyHave: "**<:nie:767387690248437840> | Już posiadasz ten przedmiot.**",
	dailyCooldown: "**<:nie:767387690248437840> | Musisz zaczekać przed odebraniem kolejnego daily.**",
	buySuccess: ({member, shopItem})=>(`**<:nie:767387690248437840> | Gratulacje! Właśnie zakupiłeś ${shopItem.id} za ${shopItem.price}.**`),
	buyFail: ({member, shopItem, error})=>(`${error}`),
	shop: {
		Zmiana_Nicku: {
			noNickname: "**<:nie:767387690248437840> | Musisz podać jaki chcesz kupić nick.**",
			noPermission: "**<:nie:767387690248437840> | Bot nie ma uprawnień do zmiany twojego nicku.**",
		},
		Unwarn: {
			noWarns: "**<:nie:767387690248437840> | Nie posiadasz żadnych warnów.**",
		},
		Kolor: {
			noColor: "**<:nie:767387690248437840> | Podaj kolor jaki chcesz kupić.**",
			colorRoleNotFound: "**<:nie:767387690248437840> | Nie znaleziono roli z takim rolorem.**",
			colorNotFound: "**<:nie:767387690248437840> | Nie znaleziono koloru jaki wybrano.**",
		},
	},
};