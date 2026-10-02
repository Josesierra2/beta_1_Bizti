package com.example.beta_1_Bizti.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.beta_1_Bizti.models.Empresa;

@Service 
public class ServiciosEmpresa {

    @Autowired 
    private IRepositorioEmpresa repositorioEmpresa;

    //Guardar
    public Empresa guardarEmpresa(Empresa datosEmpresa){
        return this.repositorioEmpresa.save(datosEmpresa);
    }
}
