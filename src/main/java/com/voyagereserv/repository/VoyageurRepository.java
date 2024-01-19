package com.voyagereserv.repository;

import com.voyagereserv.domain.Voyageur;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Voyageur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VoyageurRepository extends JpaRepository<Voyageur, Long> {}
