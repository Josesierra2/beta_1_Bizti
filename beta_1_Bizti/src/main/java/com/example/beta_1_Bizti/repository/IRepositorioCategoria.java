package com.example.beta_1_Bizti.repository;

import java.util.UUID;
import java.util.Locale.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.beta_1_Bizti.models.Categoria;
import com.example.beta_1_Bizti.models.Empresa;

@Repository 
public interface IRepositorioCategoria extends JpaRepository <Categoria, UUID>{

    
} 
    

