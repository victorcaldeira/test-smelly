const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  it('deve criar um usuário com os dados corretos', () => {
    const usuario = userService.createUser(
      'Fulano de Tal',
      'fulano@teste.com',
      25
    );

    expect(usuario).toEqual(
      expect.objectContaining({
        nome: 'Fulano de Tal',
        email: 'fulano@teste.com',
        idade: 25,
        isAdmin: false,
        status: 'ativo'
      })
    );
    expect(usuario.id).toBeDefined();
    expect(usuario.createdAt).toBeInstanceOf(Date);
  });

  it('deve buscar um usuário pelo id', () => {
    const usuarioCriado = userService.createUser(
      'Fulano de Tal',
      'fulano@teste.com',
      25
    );

    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    expect(usuarioBuscado).toEqual(usuarioCriado);
  });

  it('deve retornar null ao buscar usuário inexistente', () => {
    const usuarioBuscado = userService.getUserById('id-inexistente');

    expect(usuarioBuscado).toBeNull();
  });

  it('deve desativar usuário comum', () => {
    const usuario = userService.createUser(
      'Usuário Comum',
      'comum@teste.com',
      30
    );

    const resultado = userService.deactivateUser(usuario.id);

    expect(resultado).toBe(true);
    expect(userService.getUserById(usuario.id)).toEqual(
      expect.objectContaining({
        status: 'inativo'
      })
    );
  });

  it('não deve desativar usuário administrador', () => {
    const administrador = userService.createUser(
      'Administrador',
      'admin@teste.com',
      40,
      true
    );

    const resultado = userService.deactivateUser(administrador.id);

    expect(resultado).toBe(false);
    expect(userService.getUserById(administrador.id)).toEqual(
      expect.objectContaining({
        status: 'ativo',
        isAdmin: true
      })
    );
  });

  it('deve retornar false ao tentar desativar usuário inexistente', () => {
    const resultado = userService.deactivateUser('id-inexistente');

    expect(resultado).toBe(false);
  });

  it('deve gerar relatório informando ausência de usuários', () => {
    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('Relatório de Usuários');
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });

  it('deve gerar relatório contendo os dados principais dos usuários', () => {
    const alice = userService.createUser('Alice', 'alice@email.com', 28);
    const bob = userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('Relatório de Usuários');
    expect(relatorio).toContain(alice.id);
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('ativo');
    expect(relatorio).toContain(bob.id);
    expect(relatorio).toContain('Bob');
  });

  it('deve lançar erro ao criar usuário menor de idade', () => {
    expect(() => {
      userService.createUser('Menor', 'menor@email.com', 17);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  it('deve lançar erro ao criar usuário sem dados obrigatórios', () => {
    expect(() => {
      userService.createUser('', 'semnome@email.com', 25);
    }).toThrow('Nome, email e idade são obrigatórios.');

    expect(() => {
      userService.createUser('Sem Email', '', 25);
    }).toThrow('Nome, email e idade são obrigatórios.');

    expect(() => {
      userService.createUser('Sem Idade', 'semidade@email.com');
    }).toThrow('Nome, email e idade são obrigatórios.');
  });
});
