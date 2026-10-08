package com.example.beta_1_Bizti.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.beta_1_Bizti.models.Categoria;
import com.example.beta_1_Bizti.models.Empresa;
import com.example.beta_1_Bizti.repository.IRepositorioCategoria;

@Service 
public class ServiciosCategoria {

    @Autowired 
        private IRepositorioCategoria repositorioCategoria;

        //Guardar 
        public Categoria guardCategoria(Categoria datosCategoria){
                return this.repositorioCategoria.save(datosCategoria);
        }

    }