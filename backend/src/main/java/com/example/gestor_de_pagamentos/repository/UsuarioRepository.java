package com.example.gestor_de_pagamentos.repository;

import com.example.gestor_de_pagamentos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
