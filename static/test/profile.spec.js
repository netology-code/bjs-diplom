'use strict';

describe('Класс Profile', () => {
	const Ivan  = {
		username: 'username',
		name: {
			firstName: 'firstName',
			lastName: 'lastName'
		},
		password: 'password'
	};

	describe('Конструктор new Profile()', () => {
		it('Создает объект со свойством username, которое является строкой', () => {
			const player = new Profile(Ivan);

			expect(player.username).to.be.a('string');
		});

		it('Создает объект со свойством name, которое является объектом с двумя ключами: имя и фамилия', () => {
			const player = new Profile(Ivan);

			expect(player.name).to.be.an('object');
		});

		it('Создает объект со свойством password, которое является строкой', () => {
			const player = new Profile(Ivan);

			expect(player.password).to.be.a('string');
		});
	});
});